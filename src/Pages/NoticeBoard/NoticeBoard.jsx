import React, { useState } from "react";
import { Link, Upload, X,  } from "lucide-react";
import { useCreateNoticeMutation } from "../../features/api/noticesApi";
import { LuSquareArrowLeft } from "react-icons/lu";
import { FaCheck, FaPlus } from "react-icons/fa";
import { message } from "antd";
import { MdFilePresent } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NoticeBoard = () => {
  const [createNotice, { isLoading, isError, error }] =
    useCreateNoticeMutation();

  const [formData, setFormData] = useState({
    targetType: "individual",
    noticeTitle: "",
    employeeId: "",
    employeeName: "",
    position: "",
    noticeType: "",
    publishDate: "",
    noticeBody: "",
    selectedCategories: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNoticeTypeDropdown, setShowNoticeTypeDropdown] = useState(false);
  const [publishedNoticeTitle, setPublishedNoticeTitle] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();

  const noticeCategories = [
    "Warning / Disciplinary",
    "Performance Improvement",
    "Appreciation / Recognition",
    "Attendance / Leave Issue",
    "Payroll / Compensation",
    "Contract / Role Update",
    "Advisory / Personal Reminder",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      noticeType: category,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
    setShowNoticeTypeDropdown(false);
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        file: file,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        file: file,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.noticeTitle.trim()) {
      errors.noticeTitle = "Notice title is required";
    }

    if (!formData.employeeId) {
      errors.employeeId = "Employee ID is required";
    }

    if (!formData.employeeName.trim()) {
      errors.employeeName = "Employee name is required";
    }

    if (!formData.position) {
      errors.position = "Position is required";
    }

    if (!formData.noticeType) {
      errors.noticeType = "Notice type is required";
    }

    if (!formData.publishDate) {
      errors.publishDate = "Publish date is required";
    }

    if (!formData.noticeBody.trim()) {
      errors.noticeBody = "Notice body is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      message.error("Please fill in all required fields");
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("targetType", formData.targetType);
      formDataToSend.append("noticeTitle", formData.noticeTitle);
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("employeeName", formData.employeeName);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("noticeType", formData.noticeType);
      formDataToSend.append("noticeBody", formData.noticeBody);
      formDataToSend.append("publishDate", formData.publishDate);
      formDataToSend.append("status", "draft");

      uploadedFiles.forEach((fileObj) => {
        formDataToSend.append("attachments", fileObj.file);
      });

      const response = await createNotice(formDataToSend).unwrap();

      setPublishedNoticeTitle(formData.noticeTitle);
      setShowSuccess(true);
    } catch (err) {
      console.error("Failed to create notice:", err);
      message.warning(
        `Error: ${
          err?.data?.message || "Failed to publish notice. Please try again."
        }`
      );
    }
  };

  const handleSaveAsDraft = async () => {
    if (!validateForm()) {
      message.warning("Please fill in all required fields");
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("targetType", formData.targetType);
      formDataToSend.append("noticeTitle", formData.noticeTitle);
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("employeeName", formData.employeeName);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("noticeType", formData.noticeType);
      formDataToSend.append("noticeBody", formData.noticeBody);
      formDataToSend.append("publishDate", formData.publishDate);
      formDataToSend.append("status", "draft");

      uploadedFiles.forEach((fileObj) => {
        formDataToSend.append("attachments", fileObj.file);
      });

      await createNotice(formDataToSend).unwrap();

      message.success("Notice saved as draft successfully!");
      handleReset();
    } catch (err) {
      console.error("Failed to save draft:", err);
      message.warning(
        `Error: ${
          err?.data?.message || "Failed to save draft. Please try again."
        }`
      );
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      targetType: "individual",
      noticeTitle: "",
      employeeId: "",
      employeeName: "",
      position: "",
      noticeType: "",
      publishDate: "",
      noticeBody: "",
      selectedCategories: [],
    });
    setUploadedFiles([]);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    handleReset();
  };

  return (
    <div className="min-h-screen p-6 mt-10">
      <div className="mx-auto">
        {/*=================== Header=================== */}
        <div className="flex items-center gap-3 mb-2">
          <button className="p-2 transition-colors rounded-lg hover:bg-gray-100">
            <LuSquareArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            Create a Notice
          </h1>
        </div>

        {/*=================== Form Container=================== */}
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="mb-2 text-sm text-gray-600">
            Please fill in the details below
          </p>
          <hr className="mb-2" />
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Target Department(s) or
              Individual
            </label>
            <select
              value={formData.targetType}
              onChange={(e) => handleInputChange("targetType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-cyan-500"
            >
              <option value="individual">Individual</option>
              <option value="department">Department</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Notice Title
            </label>
            <input
              type="text"
              placeholder="Write the Title of Notice"
              value={formData.noticeTitle}
              onChange={(e) => handleInputChange("noticeTitle", e.target.value)}
              className={`w-full px-3 py-2 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.noticeTitle
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.noticeTitle && (
              <p className="mt-1 text-xs text-red-500">
                {validationErrors.noticeTitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Select Employee ID
              </label>
              <input
                type="text"
                placeholder="Enter employee ID"
                value={formData.employeeId}
                onChange={(e) =>
                  handleInputChange("employeeId", e.target.value)
                }
                className={`w-full px-3 py-2 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  validationErrors.employeeId
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.employeeId && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.employeeId}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Employee Name
              </label>
              <input
                type="text"
                placeholder="Enter employee full name"
                value={formData.employeeName}
                onChange={(e) =>
                  handleInputChange("employeeName", e.target.value)
                }
                className={`w-full px-3 py-2 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  validationErrors.employeeName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.employeeName && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.employeeName}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Position
              </label>
              <input
                type="text"
                placeholder="Enter position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className={`w-full px-3 py-2 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  validationErrors.position
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.position && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.position}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-2">
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Notice Type
              </label>
              <div
                onClick={() =>
                  setShowNoticeTypeDropdown(!showNoticeTypeDropdown)
                }
                className={`w-full px-3 py-2 bg-white border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  validationErrors.noticeType
                    ? "border-red-500"
                    : "border-gray-300"
                } ${formData.noticeType ? "text-gray-900" : "text-gray-400"}`}
              >
                {formData.noticeType || "Select Notice Type"}
              </div>
              {validationErrors.noticeType && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.noticeType}
                </p>
              )}

              {showNoticeTypeDropdown && (
                <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-64">
                  {noticeCategories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleCategory(category)}
                    >
                      <input
                        type="radio"
                        checked={formData.noticeType === category}
                        onChange={() => {}}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Publish Date
              </label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) =>
                  handleInputChange("publishDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  validationErrors.publishDate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.publishDate && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.publishDate}
                </p>
              )}
            </div>
          </div>

          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Notice Body
            </label>
            <textarea
              placeholder="Write the details about notice"
              value={formData.noticeBody}
              onChange={(e) => handleInputChange("noticeBody", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 placeholder-gray-400 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.noticeBody
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.noticeBody && (
              <p className="mt-1 text-xs text-red-500">
                {validationErrors.noticeBody}
              </p>
            )}
          </div>

          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Attachments (optional)
            </label>
            <div
              className="p-8 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-teal-400"
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-6 mb-2 rounded-full bg-teal-50">
                  <Upload className="w-6 h-6 text-teal-500" />
                </div>
                <p className="mb-1 text-sm text-gray-600">
                  <span className="font-medium text-teal-500 cursor-pointer">
                    Upload
                  </span>{" "}
                  files or drag and drop.
                </p>
                <p className="text-xs text-gray-400">
                  Accepted File Type: jpg, png, pdf
                </p>
              </div>
            </div>
          </div>

          {/* ====================Uploaded Files ==================== */}
          {uploadedFiles.length > 0 && (
            <div className="mb-2 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 rounded-md bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded">
                      <span className="text-xs font-semibold text-orange-600">
                        <MdFilePresent/>
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">{file.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFileRemove(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 pt-4 md:flex-row">
            <button
              onClick={handleReset}
              className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-full hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAsDraft}
              disabled={isLoading}
              className="px-6 py-2 text-orange-500 transition-colors border border-orange-500 rounded-full hover:bg-orange-50 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save as Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-2 text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600 disabled:opacity-50"
            >
              <FaCheck className="w-5 h-5" /> {isLoading ? "Publishing..." : "Publish Notice"}
            </button>
          </div>
        </div>
      </div>

      {/* ================================Success Modal ================================ */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-xl p-8 mx-4 bg-white rounded-lg">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-teal-500 rounded-full">
                <FaCheck className="text-white size-8" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Notice Published Successfully
              </h2>
              <p className="mb-2 text-sm text-gray-600">
                Your notice "{publishedNoticeTitle}" has been published and is
                now visible to all selected departments.
              </p>
              <div className="flex flex-col w-full gap-1 md:flex-row md:flex-1 md:gap-3">
                <button 
                  onClick={() => navigate("/employee-database")}
                className="flex-1 px-2 md:px-4 py-1 text-[#3B82F6] transition-colors border border-[#3B82F6] rounded-full hover:bg-gray-50">
                
                  View Notice
               
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="flex items-center justify-center px-2 py-1 text-orange-500 transition-colors border border-orange-500 rounded-full md:px-4 gap-x-2 hover:bg-orange-50"
                >
                  <FaPlus />
                  <span>Create Another</span>
                </button>
                <button
                  onClick={handleCloseSuccess}
                  className="flex-1 px-2 md:px-4 py-1 text-[#232948] transition-colors border border-[#232948] rounded-full hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
