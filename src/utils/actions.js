import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, runTransaction, updateDoc, writeBatch } from "firebase/firestore";
import { assignPairs } from "./utils";

export const uploadImages = async (images, firstId, secondId, setUploadedImagesUrls) => {
    const urls = [];
    for (const image of images) {
        const imageRef = ref(storage, `images/${firstId}/${secondId}/${image.name}`);
        await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(imageRef);
        urls.push(downloadURL);
    }
    setUploadedImagesUrls(urls); // Update URLs in state
    return urls;
};

export const submitWishlist = async (firstId, secondId, wishList, images, setUploadedImagesUrls) => {
    try {
        const imageUrls = await uploadImages(images, firstId, secondId, setUploadedImagesUrls); // Upload images first
        const namesDocRef = doc(db, 'links', firstId, 'names', secondId);

        const docSnap = await getDoc(namesDocRef);
        if (docSnap.exists()) {
            await updateDoc(namesDocRef, { wishList, images: imageUrls });
        } else {
            console.log('Document does not exist');
        }
    } catch (error) {
        console.error('Error fetching document:', error.message);
    } finally {
        console.log('done');
    }
};

export const createLink = async (member, setIsLoading, setIsExisting, generateNames, setLinkUrl) => {
    if (!member) return;
    setIsLoading(true);

    try {
        let linkId;
        let generatedUrl = localStorage.getItem('generatedUrl');

        if (generatedUrl) {
            linkId = generatedUrl.split('/').pop();
            setIsExisting(true);
        } else {
            // Create the main document
            setIsExisting(false);
            const linkRef = await addDoc(collection(db, "links"), {
                member: Number(member),
                created: new Date().toISOString()
            });

            linkId = linkRef.id;
            generatedUrl = `${window.location.origin}/${linkId}`;

            // Generate names
            const names = generateNames(Number(member));
            console.log('Generated names:', names); // Debug log

            // Assign pairs
            const pairs = assignPairs(names);
            console.log('Generated pairs:', pairs); // Debug log

            // Use a batch write to ensure all documents are created
            const batch = writeBatch(db);
            const namesCollectionRef = collection(db, 'links', linkId, 'names');

            // Add each name document to the batch
            pairs.forEach((pair) => {
                const newNameRef = doc(namesCollectionRef);
                batch.set(newNameRef, {
                    name: pair.giver,
                    manito: pair.receiver,
                    created: new Date().toISOString()
                });
            });

            // Commit the batch
            await batch.commit();
            console.log('Batch write completed'); // Debug log

            localStorage.setItem('generatedUrl', generatedUrl);
        }

        setLinkUrl(generatedUrl);

    } catch (err) {
        console.error("Error creating link:", err);
    } finally {
        setIsLoading(false);
    }
};

export const handleNameSelect = async (name, setError, linkId, setSelectedName, storageKey) => {
    setError(null);
    const nameDocRef = doc(db, 'links', linkId, 'names', name.id);
    const timestamp = new Date().toISOString();

    try {
        // Run the transaction
        await runTransaction(db, async (transaction) => {
            const nameDoc = await transaction.get(nameDocRef);

            // Check if the document exists
            if (!nameDoc.exists()) {
                throw new Error("Name no longer exists");
            }

            const nameData = nameDoc.data();

            // Check if name is already taken
            if (nameData.isTaken) {
                throw new Error(`Sorry, "${name.name}" was just taken by someone else.`);
            }

            // If we get here, the name is available, so let's claim it
            transaction.update(nameDocRef, {
                isTaken: true,
                takenAt: timestamp,
            });
        });

        // If transaction succeeds, update local state
        const nameData = {
            name: name.name,
            nameId: name.id,
            timestamp: timestamp,
        };

        setSelectedName(nameData);
        localStorage.setItem(storageKey, JSON.stringify(nameData));

    } catch (err) {
        console.error('Transaction failed:', err);
        setError(err.message || "Failed to select name. Please try another one.");
    }
};

export const deleteImageFromFirebase = async (firstId, secondId, imageUrl) => {
    try {
        // 1. Create a reference to the image in Firebase Storage
        const imageRef = ref(storage, imageUrl);

        // 2. Delete the image from Storage
        await deleteObject(imageRef);

        // 3. Update the Firestore document to remove the image URL
        const docRef = doc(db, 'wishlists', `${firstId}_${secondId}`);
        await updateDoc(docRef, {
            image: arrayRemove(imageUrl)
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

export const deleteLink = async (linkURL, member, setIsLoading, setIsExisting, generateNames, setLinkUrl) => {
    try {
        setIsLoading(true)
        const urlParts = linkURL.split('/');
        const linkId = urlParts[urlParts.length - 1];

        const linkRef = doc(db, "links", linkId);

        const linkDoc = await getDoc(linkRef);

        if (linkDoc.exists()) {
            localStorage.removeItem('generatedUrl');
            // Specify the subcollection name
            const subcollectionName = "names"; // replace with actual subcollection name
            const subcollectionRef = collection(linkRef, subcollectionName);

            // Get all documents in the subcollection
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            // Delete each document in the subcollection
            const deletePromises = subcollectionSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // Finally, delete the main document
            await deleteDoc(linkRef);
            console.log("Document and its subcollection deleted successfully");

            createLink(member, setIsLoading, setIsExisting, generateNames, setLinkUrl);
        }
    }
    catch (err) { console.log(err) }
};