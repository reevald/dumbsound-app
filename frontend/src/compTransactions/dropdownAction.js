import iconDropdown from "../src-assets/image/icon-dropdown.svg";
import { useState } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import { API } from "../config/api";

function CompDropdownAction(props) {
  const paymentId = props.paymentId;
  const api = API();
  const history = useHistory();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggleModal = () => {
    return setIsOpenModal(!isOpenModal);
  }

  const closeModal = () => {
    return setIsOpenModal(false);
  }

  // Form donate handler
  const onSubmitHandler = useMutation(async (type) => {
    console.log("type", type);

    // Logic approve or cancel
    try {
      const config = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({status: type})
      }

      const response = await api.patch(`/transaction/${paymentId}`, config);
      if (response.status === "success") return history.go(0);
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <div className="relative h-16 w-16">
      <div className="flex flex-row h-full justify-center">
        <img
          onClick={() => toggleModal()}
          className="w-4" src={iconDropdown} alt="Action Payment" />
      </div>
      {isOpenModal ?
        <>
          <div
            className='flex-none fixed inset-x-0 top-0 h-screen bg-transparent z-20'
            onClick={() => closeModal()}
          />
          <div className="relative right-11 top-0 flex flex-col rounded-lg py-2 z-30 w-24 bg-gray-ds-300">
            <div
              className='absolute right-2 -top-5 w-0 h-0 border-x-12 border-b-24 border-b-gray-ds-300 border-x-transparent'
            />
            <div
              onClick={() => onSubmitHandler.mutate("Approve")}
              className="px-2 text-green-500 mb-2 hover:text-green-300 cursor-pointer"
            >
              Approve
            </div>
            <div className="h-0.5 bg-gray-500" />
            <div
              onClick={() => onSubmitHandler.mutate("Cancel")}
              className="px-2 text-red-500 mt-2 hover:text-red-300 cursor-pointer"
            >
              Cancel
            </div>
          </div>
        </>
        :
        <></>
      }
    </div>
  );
}

export default CompDropdownAction;