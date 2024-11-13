import React from 'react'

function WishListDetailModal({ setIsModalOpen, name }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                key={name.id}
                className="p-4 bg-white rounded-lg shadow-md border-l-4 border-cherry-red"
            >
                <h3 className="text-lg font-medium text-gray-900 mb-2">{name.name}</h3>
                <p className="text-gray-700 mb-2">
                    Wish List: {name.wishList || 'No wishlist provided yet'}
                </p>

                {name.images && name.images.length > 0 && (
                    <div>
                        <h4 className="text-gray-800 font-medium mb-2">Uploaded Images:</h4>
                        <div className="flex flex-wrap gap-2">
                            {name.images.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Uploaded ${index}`}
                                    className="w-20 h-20 object-cover rounded"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
                Close
            </button>
        </div>
    )
}

export default WishListDetailModal