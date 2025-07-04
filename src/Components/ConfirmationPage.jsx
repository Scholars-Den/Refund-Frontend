export const ConfirmationPage = ({ formData, documentUrl, onEdit, onConfirm, isSubmitting }) => {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Confirm Your Details</h2>
      <div className="bg-gray-50 border p-4 rounded-md text-sm space-y-2">
        {Object.entries(formData).map(([key, value]) => {
          if (key === "document") return null; // skip file object
          return (
            <div key={key} className="flex justify-between">
              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-medium">{value || "-"}</span>
            </div>
          );
        })}
        <div className="mt-2">
          <span className="block font-semibold">Uploaded Document:</span>
          {documentUrl ? (
            <img src={documentUrl} alt="Bank Document" className="h-32 mt-2 rounded border" />
          ) : (
            <span className="text-red-500">No document uploaded.</span>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onEdit}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Confirm & Submit"}
        </button>
      </div>
    </div>
  );
};
