import React from 'react'

function ConfirmationModal({setIsModalOpen, confirmDelete}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Delete Image</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this image? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => confirmDelete()}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal