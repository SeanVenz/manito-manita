import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, runTransaction, updateDoc, writeBatch } from "firebase/firestore";
import { assignPairs } from "./utils";
import { toast } from "react-toastify";

export const uploadImages = async (images, firstId, secondId, setUploadedImagesUrls) => {
    const urls = [];
    for (const image of images) {
        const imageRef = ref(storage, `images/${firstId}/${secondId}/${image.name}`);
        await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(imageRef);
        urls.push(downloadURL);
    }
    setUploadedImagesUrls(urls);
    return urls;
};

export const submitWishlist = async (firstId, secondId, wishList, images, setUploadedImagesUrls) => {
    try {
        const namesDocRef = doc(db, 'links', firstId, 'names', secondId);

        const docSnap = await getDoc(namesDocRef);

        const newImageUrls = await uploadImages(images, firstId, secondId, setUploadedImagesUrls);

        if (docSnap.exists()) {
            const existingImages = docSnap.data().images || [];

            const combinedImageUrls = [...existingImages, ...newImageUrls];

            await updateDoc(namesDocRef, {
                wishList,
                images: combinedImageUrls
            });
        } else {
        }
    } catch (error) {
    } finally {
    }
};

export const createLink = async (member, setIsLoading, setIsExisting, generateNames, setLinkUrl, setError, manualNames = null) => {
    if (!member && (!manualNames || manualNames.length === 0)) return;
    setIsLoading(true);
    setError('');

    try {
        const times = localStorage.getItem('times');
        const dateCreated = localStorage.getItem('createdAt');

        if (times) {
            let increment = parseInt(JSON.parse(times));
            
            if (increment >= 5) {
                if (dateCreated) {
                    const lastCreationDate = new Date(dateCreated);
                    const currentDate = new Date();
                    const timeDifference = currentDate - lastCreationDate;
                    const oneDay = 24 * 60 * 60 * 1000;

                    if (timeDifference < oneDay) {
                        setIsLoading(false);
                        setError('You can only create 3 links per day. Please try again tomorrow.');
                        return;
                    } else {
                        localStorage.setItem('times', 1);
                        localStorage.setItem('createdAt', new Date().toISOString());
                    }
                }
            } else {
                increment += 1;
                localStorage.setItem('times', increment);
                if (increment === 1) {
                    localStorage.setItem('createdAt', new Date().toISOString());
                }
            }
        } else {
            localStorage.setItem('times', '1');
            localStorage.setItem('createdAt', new Date().toISOString());
        }

        let linkId;
        let generatedUrl = localStorage.getItem('generatedUrl');

        if (generatedUrl) {
            linkId = generatedUrl.split('/').pop();
            setIsExisting(true);
        } else {
            setIsExisting(false);
            const linkRef = await addDoc(collection(db, "links"), {
                member: Number(member),
                created: new Date().toISOString()
            });

            linkId = linkRef.id;
            generatedUrl = `${window.location.origin}/${linkId}`;

            // Use manual names if provided, otherwise generate random names
            const names = manualNames || generateNames(Number(member));

            const pairs = assignPairs(names);

            const batch = writeBatch(db);
            const namesCollectionRef = collection(db, 'links', linkId, 'names');

            pairs.forEach((pair) => {
                const newNameRef = doc(namesCollectionRef);
                batch.set(newNameRef, {
                    name: pair.giver,
                    manito: pair.receiver,
                    created: new Date().toISOString()
                });
            });

            await batch.commit();

            localStorage.setItem('generatedUrl', generatedUrl);
        }
        setLinkUrl(generatedUrl);

    } catch (err) {
        setError('An error occurred while creating the link. Please try again.');
    } finally {
        setIsLoading(false);
    }
};

export const handleNameSelect = async (name, setError, linkId, setSelectedName, storageKey, setIsPickingName) => {
    setError(null);
    setIsPickingName(true);
    const nameDocRef = doc(db, 'links', linkId, 'names', name.id);
    const timestamp = new Date().toISOString();
    try {
        await runTransaction(db, async (transaction) => {
            const nameDoc = await transaction.get(nameDocRef);

            if (!nameDoc.exists()) {
                throw new Error("Name no longer exists");
            }

            const nameData = nameDoc.data();

            if (nameData.isTaken) {
                throw new Error(`Sorry, "${name.name}" was just taken by someone else.`);
            }

            transaction.update(nameDocRef, {
                isTaken: true,
                takenAt: timestamp,
            });
        });

        const nameData = {
            name: name.name,
            nameId: name.id,
            timestamp: timestamp,
        };

        setSelectedName(nameData);
        localStorage.setItem(storageKey, JSON.stringify(nameData));
        toast.success("Successfully chose a nickname!");

    } catch (err) {
        setError(err.message || "Failed to select name. Please try another one.");
    }
    finally {
        setIsPickingName(false);
    }
};

export const deleteImageFromFirebase = async (firstId, secondId, imageUrl) => {
    try {
        const imageRef = ref(storage, imageUrl);

        await deleteObject(imageRef);

        const docRef = doc(db, 'wishlists', `${firstId}_${secondId}`);
        await updateDoc(docRef, {
            image: arrayRemove(imageUrl)
        });

    } catch (error) {
        throw error;
    }
};

export const deleteLink = async (linkURL, member, setIsLoading, setIsExisting, generateNames, setLinkUrl, setError, manualNames = null) => {
    try {
        setIsLoading(true);
        const urlParts = linkURL.split('/');
        const linkId = urlParts[urlParts.length - 1];
        const linkRef = doc(db, "links", linkId);
        const linkDoc = await getDoc(linkRef);

        if (linkDoc.exists()) {
            localStorage.removeItem('generatedUrl');

            const subcollectionRef = collection(linkRef, "names");
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            const deletePromises = subcollectionSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            const storage = getStorage();
            const firstId = linkId; 

            try {
                const firstLevelRef = ref(storage, `images/${firstId}`);

                const result = await listAll(firstLevelRef);

                const deletePromises = [];

                result.items.forEach((itemRef) => {
                    deletePromises.push(deleteObject(itemRef));
                });

                for (const prefix of result.prefixes) {
                    const subResult = await listAll(prefix);
                    subResult.items.forEach((itemRef) => {
                        deletePromises.push(deleteObject(itemRef));
                    });
                }

                await Promise.all(deletePromises);

            } catch (storageError) {
                
            }

            await deleteDoc(linkRef);

            createLink(member, setIsLoading, setIsExisting, generateNames, setLinkUrl, setError, manualNames);
        }
    } catch (err) {
        setIsLoading(false);
    }
};

export const confirmDelete = async (imageToDelete, firstId, secondId, setIsModalOpen, setImageToDelete, refetch, setIsDeleting) => {
    try {
        setIsDeleting(true);
        const imageUrl = imageToDelete;
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);

        const docRef = doc(db, 'links', firstId, 'names', secondId);
        await updateDoc(docRef, {
            images: arrayRemove(imageUrl)
        });

        setIsModalOpen(false);
        setImageToDelete(null);
        refetch();
        toast.success("Image successfully deleted")
        setIsDeleting(false);
    } catch (error) {
        setIsDeleting(false);
    }
};