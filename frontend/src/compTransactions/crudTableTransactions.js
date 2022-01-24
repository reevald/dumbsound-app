import CompDropdownAction from "./dropdownAction";

import { useQuery } from "react-query";
import { API } from "../config/api";

function CompCrudTabelTransactions() {
  const api = API();

  const { data: listTransactions } = useQuery("getListTransactions", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }

    const response = await api.get("/transactions", config);
    if (response.status === "success") return response.data;
    if (response.status === "failed") return null;
  });

  const remainDaysHandler = (strDueDate, status) => {
    let statusSub = "Not Active";
    let remainDay = "0";
    if (status === "Approve") {
      const dueDate = strDueDate.split("/");
      // Swap month and day
      const millisecondDueDate = Date.parse(`${dueDate[1]}/${dueDate[0]}/${dueDate[2]}`);
      const millisecondNowDate = Date.now();
      if (millisecondNowDate <= millisecondDueDate) {
        const millisecondPerDay = 86400 * 1000;
        const diffDays = Math.ceil(
          (millisecondDueDate - millisecondNowDate) / millisecondPerDay
        )
        remainDay = `${diffDays}`;
        statusSub = "Active";
      }
    }

    return (
      <>
        <td>{remainDay} / Hari</td>
        <td
          className={(statusSub === "Active") ? "text-green-500" : "text-red-500"}
        >
          {statusSub}
        </td>
      </>
    );
  }

  return (
    <div className='flex flex-row justify-center py-16 w-full'>
      <div className='flex flex-col h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-36'>
        <div className="text-2xl font-bold mb-10 mt-8 text-white">
          Incoming Transaction
        </div>
        <div className="text-left">
          <table className="table-auto w-full">
            <thead className="bg-gray-ds-110 text-orange-ds-200 h-16">
              <tr className="text-center">
                <th>No</th>
                <th>Users</th>
                <th>Bukti Transfer</th>
                <th>Remaining Active</th>
                <th>Status User</th>
                <th>Status Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listTransactions?.map((item, index) => (
                <tr key={item.id} className="even:bg-gray-ds-110 odd:bg-gray-ds-100 text-white h-16 border-y-2 border-gray-500">
                  <td className="text-center">{index + 1}</td>
                  <td>{item.user.fullName}</td>
                  <td>{item.attache}</td>
                  {remainDaysHandler(item.dueDate, item.status)}
                  <td
                    className={
                      (item.status === "Approve") ? "text-green-500" :
                        (item.status === "Cancel") ? "text-red-500" :
                          (item.status === "Pending") ? "text-yellow-500" :
                            null
                    }
                  >{item.status}</td>
                  <td className="w-16 h-16 cursor-pointer align-middle">
                    <CompDropdownAction paymentId={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CompCrudTabelTransactions;