import { faker } from "@faker-js/faker";
import { submitWishlist } from "./actions";

export const handleImageChange = (e, setImages) => {
    setImages(Array.from(e.target.files));
};

export const generateNames = (memberCount) => {
    return Array.from({ length: memberCount }, () => faker.name.firstName());
};

export const assignPairs = (names) => {
    let receivers = [...names];
    let givers = [...names];
    let pairs = [];

    // Fisher-Yates shuffle for receivers
    for (let i = receivers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
    }

    // Ensure no self-assignments
    for (let i = 0; i < givers.length; i++) {
        if (receivers[i] === givers[i]) {
            // Swap with the next person (cyclically)
            const nextIndex = (i + 1) % givers.length;
            [receivers[i], receivers[nextIndex]] = [receivers[nextIndex], receivers[i]];
        }
    }

    // Create pairs
    for (let i = 0; i < givers.length; i++) {
        pairs.push({
            giver: givers[i],
            receiver: receivers[i]
        });
    }

    return pairs;
};

export const handleMemberChange = (e, setMember) => {
    const value = e.target.value;
    if (value === "" || (Number(value) > 0 && Number(value) <= 100)) {
        setMember(value);
    }
};

export const handleWishListChange = (e, setWishList) => {
    setWishList(e.target.value);
};

export const handleImageChangeWishList = (e, images, setImages, setImagePreviews) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
};

export const removeImage = (index, images, setImages, imagePreviews, setImagePreviews) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    const previewUrl = imagePreviews[index];
    URL.revokeObjectURL(previewUrl);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
};

export const handleSubmitWishlist = async (setIsSubmitting, submitWishlist, firstId, secondId, wishList, images, setUploadedImagesUrls, setImages, setImagePreviews, refetch) => {
    try {
        setIsSubmitting(true);
        await submitWishlist(firstId, secondId, wishList, images, setUploadedImagesUrls);

        setImages([]);
        setImagePreviews([]);
        await refetch();

        setIsSubmitting(false);
    } catch (error) {
        console.error('Error submitting wishlist:', error);
        setIsSubmitting(false);
    }
};

export const handleRemoveImageInFirebase = (url, setImageToDelete, setIsModalOpen) => {
    setImageToDelete(url);
    setIsModalOpen(true);
  };