import { useState } from 'react';
import InputField from '../Shared/InputField';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { AUTHTOKEN_LOCALSTORAGE } from '@/app/constants';
import ButtonField from '../Shared/ButtonField';

interface FormValues {
  sheetName: string;
}

const CreateSheetModal: React.FC<{closePopUp : ()=>void}> = ({closePopUp}) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
   const router = useRouter();
    const navigateToSheet = (sheetName : string) => {
      router.push(`sheets/${sheetName}`);
    };
  const formik = useFormik<FormValues>({
      initialValues: {
        sheetName: "",
      },
      validate: (values) => {
        const errors: Partial<FormValues> = {};
        if (!values.sheetName) {
          errors.sheetName = "Sheet name is required.";
        } else if (values.sheetName.length < 3) {
          errors.sheetName = "Sheet name must be at least 3 characters.";
        } else if (values.sheetName.length > 15) {
          errors.sheetName = "Sheet name cannot exceed 15 characters.";
        }
        return errors;
      },
      onSubmit: async (values) => {
        const token = localStorage.getItem(AUTHTOKEN_LOCALSTORAGE);
        const response = await fetch("/api/sheets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        const data = await response.json()
        console.log(data);
        
        if (response.ok) {
          setMessage("The sheet is created successfully!");
          setMessageType("success");
          navigateToSheet(data.data.id);
        } else {
          setMessage("failed. Please try again.");
          setMessageType("error");
        }
      },
    });
  return (
    <div className="w-full h-screen bg-[#000000b0] backdrop-blur-sm fixed top-0 left-0 z-50 flex justify-center items-center">
      <div className="w-3/4 sm:w-1/2 bg-white rounded-lg shadow-lg p-8 relative">
        <button
          onClick={closePopUp}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-center text-2xl text-[#00222e] font-bold mb-6">
          Create Sheet
        </h2>
        {message && (
          <div
            className={`text-center ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            <p>{message}</p>
          </div>
        )}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full">
              <InputField
                type="text"
                name="sheetName"
                placeholder="Enter Sheet Name"
                style={`px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00222e]`}
                value={formik.values.sheetName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.errors.sheetName && formik.touched.sheetName && (
                <span className="text-red-500 text-sm">
                  {formik.errors.sheetName}
                </span>
              )}
            </div>
            <ButtonField
              title="Submit"
              type="submit"
              style="px-6 py-2 bg-[#00222e] text-white font-semibold rounded hover:bg-[#014a6d] transition"
              handleButtonClick={() => {}}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateSheetModal;
