// import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useRef } from "react";

// interface IRegisterUserModalProps {
//   setPreviewImage: (imagUrl: string) => void;
//   previewImage: string;
//   setShowModal: (showModal: boolean) => void;
// }
// export default function RegisterUserModal(props: IRegisterUserModalProps) {
//   const { setPreviewImage, previewImage, setShowModal } = props;

//   const inputFile = useRef<HTMLInputElement>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files && e.target.files[0];
//     if (
//       file &&
//       file.size <= 2 * 1024 * 1024 &&
//       ["image/png", "image/jpg", "image/jpeg"].includes(file.type)
//     ) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert(
//         "Please select a valid image file (png, jpg, jpeg) with size up to 2MB."
//       );
//     }
//   };

//   return (
//     <div className="form-wrapper fixed top-0 left-0 w-full h-screen bg-gray-800/30 p-6 z-50 flex items-center justify-center p-4">
//       <div className="register w-full md:w-max bg-white p-6 md:p-8 rounded-xl md:rounded-2xl text-gray-800">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Daftarkan Pelanggan Baru
//         </h2>
//         <div className="flex flex-col gap-3 md:gap-4 mt-6">
//           <div className="relative bg-gray-200 w-full md:max-w-96 h-auto aspect-video rounded-lg border border-dashed border-black flex items-center justify-center group overflow-hidden">
//             {previewImage && (
//               <img
//                 src={previewImage}
//                 alt=""
//                 className="w-full h-full object-cover"
//               />
//             )}
//             <input
//               type="file"
//               accept=".png, .jpg, .jpeg"
//               ref={inputFile}
//               onChange={handleFileChange}
//               className="hover:cursor-pointer w-full h-full opacity-0 absolute top-0 left-0 z-50"
//             />
//             <div
//               className={`w-full h-full flex gap-2 items-center justify-center absolute z-40 text-gray-900 transition-all ${
//                 previewImage ? "opacity-0" : "opacity-100"
//               } group-hover:opacity-100 group-hover:bg-white/40`}
//             >
//               <FontAwesomeIcon
//                 icon={faArrowUpFromBracket}
//                 className="text-sm"
//               />
//               <span className="font-medium">upload image</span>
//             </div>
//           </div>

//           <div className="w-full">
//             <label
//               className="block text-gray-600 text-sm mb-2"
//               htmlFor="visitor-name"
//             >
//               Nama Pelanggan
//             </label>
//             <input
//               required={true}
//               id="visitor-name"
//               type="password"
//               className="w-full p-2 bg-white text-white border border-gray-300 rounded focus:outline-blue-600"
//             />
//           </div>

//           <div className="w-full">
//             <label
//               className="block text-gray-600 text-sm mb-2"
//               htmlFor="phone-number"
//             >
//               No Telp
//             </label>
//             <input
//               id="phone-number"
//               type="password"
//               className="w-full p-2 bg-white text-white border border-gray-300 rounded focus:outline-blue-600"
//             />
//           </div>

//           <div className="flex justify-between gap-4 mt-2">
//             <button
//               onClick={() => {
//                 setShowModal(false);
//               }}
//               className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-400 rounded-md font-medium text-white"
//             >
//               cancel
//             </button>
//             <button className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-400 rounded-md font-medium text-white">
//               submit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function RegisterUserModal() {
  return <div>RegisterUserModal</div>;
}
