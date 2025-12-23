import React from 'react'
import { LuConstruction } from 'react-icons/lu'

const AddNewEmployee = () => {
  return (
    <div className="mt-20">
        <div className="flex items-center justify-center px-4 ">
          <div className="p-8 text-center bg-white shadow-lg rounded-2xl">
            <h1 className="py-5 text-2xl font-bold">Add New Employee</h1>
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 text-3xl text-yellow-600 bg-yellow-100 rounded-full">
                <LuConstruction size={50} />
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              Page Under Construction
            </h1>

            <p className="mb-6 text-gray-600">
              We’re working hard to bring you something amazing. This page will
              be available soon.
            </p>

            <div className="flex justify-center gap-3">
              <span className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 delay-150 bg-yellow-500 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 delay-300 bg-yellow-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AddNewEmployee
