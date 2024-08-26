// "use client";
// import { getRecognitionHistory } from "@/services/api/getRecognitionHistory";
// import React, { useEffect, useState } from "react";

// interface IHistory {
//   id: string;
//   name: string;
//   mobileNo: string;
// }

// export default function RecognitionHistory() {
//   const [history, setHistory] = useState<IHistory[]>([]);
//   useEffect(() => {
//     async function getHistory() {
//       try {
//         const data = await getRecognitionHistory();
//         setHistory(data);
//       } catch (error) {
//         console.error(error);
//       }
//     }

//     getHistory();
//   }, []);

//   return (
//     <div className="w-full lg:w-2/5 history bg-white h-auto rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">History</h2>
//       <div className="tables">
//         <table className="min-w-full">
//           <thead className="bg-slate-100 border-b">
//             <tr>
//               <th
//                 scope="col"
//                 className="text-sm font-semibold text-gray-600 px-6 py-4 text-left"
//               >
//                 Nama
//               </th>
//               <th
//                 scope="col"
//                 className="text-sm font-semibold text-gray-600 px-6 py-4 text-left"
//               >
//                 No HP
//               </th>
//               <th
//                 scope="col"
//                 className="text-sm font-semibold text-gray-600 px-6 py-4 text-left"
//               >
//                 Tanggal
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {history.map((data) => (
//               <tr
//                 key={data.id}
//                 className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
//               >
//                 <td className="text-sm text-gray-500 px-6 py-4 whitespace-nowrap">
//                   {data.name}
//                 </td>
//                 <td className="text-sm text-gray-500 px-6 py-4 whitespace-nowrap">
//                   {data.mobileNo}
//                 </td>
//                 <td className="text-sm text-gray-500 px-6 py-4 whitespace-nowrap">
//                   {data.id}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function RecognitionHistory() {
  return <div>RecognitionHistory</div>;
}
