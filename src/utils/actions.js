import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
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
    setUploadedImagesUrls(urls);
    return urls;
};

export const submitWishlist = async (firstId, secondId, wishList, images, setUploadedImagesUrls) => {
    try {
        const namesDocRef = doc(db, 'links', firstId, 'names', secondId);
        
        // Get the current document to check for existing images
        const docSnap = await getDoc(namesDocRef);
        
        // Upload new images
        const newImageUrls = await uploadImages(images, firstId, secondId, setUploadedImagesUrls);
        
        if (docSnap.exists()) {
            // Get existing images array or empty array if none exist
            const existingImages = docSnap.data().images || [];
            
            // Combine existing images with new images
            const combinedImageUrls = [...existingImages, ...newImageUrls];
            
            // Update document with combined images
            await updateDoc(namesDocRef, { 
                wishList, 
                images: combinedImageUrls 
            });
        } else {
        }
    } catch (error) {
        console.error('Error updating document:', error.message);
    } finally {
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

            // Assign pairs
            const pairs = assignPairs(names);

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

            localStorage.setItem('generatedUrl', generatedUrl);
        }

        setLinkUrl(generatedUrl);

    } catch (err) {
        console.error("Error creating link:", err);
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
    finally{
        //needs to run all the time in case there is error, user can choose another nickname
        setIsPickingName(false);
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
        setIsLoading(true);
        const urlParts = linkURL.split('/');
        const linkId = urlParts[urlParts.length - 1];
        const linkRef = doc(db, "links", linkId);
        const linkDoc = await getDoc(linkRef);

        if (linkDoc.exists()) {
            localStorage.removeItem('generatedUrl');
            
            // Delete subcollection documents
            const subcollectionRef = collection(linkRef, "names");
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            const deletePromises = subcollectionSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // Delete storage files
            const storage = getStorage();
            const firstId = linkId; // Using linkId as firstId

            try {
                // Reference the root folder for this firstId
                const firstLevelRef = ref(storage, `images/${firstId}`);
                
                // List all contents recursively
                const result = await listAll(firstLevelRef);
                
                // Delete all files found
                const deletePromises = [];
                
                // Process all items (files) at this level
                result.items.forEach((itemRef) => {
                    deletePromises.push(deleteObject(itemRef));
                });
                
                // Process all prefixes (folders)
                for (const prefix of result.prefixes) {
                    const subResult = await listAll(prefix);
                    subResult.items.forEach((itemRef) => {
                        deletePromises.push(deleteObject(itemRef));
                    });
                }
                
                // Wait for all deletions to complete
                await Promise.all(deletePromises);
                
            } catch (storageError) {
                console.error("Storage deletion error:", storageError);
                // Continue with document deletion even if storage deletion fails
            }

            // Finally, delete the main document
            await deleteDoc(linkRef);

            createLink(member, setIsLoading, setIsExisting, generateNames, setLinkUrl);
        }
    } catch (err) {
        console.error("Error in deleteLink:", err);
        setIsLoading(false);
    }
};

export const confirmDelete = async (imageToDelete, firstId, secondId, setIsModalOpen, setImageToDelete, refetch) => {
    try {
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
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

export const handleDeleteImagesWhenLinkIsRemoved = async () => {

}