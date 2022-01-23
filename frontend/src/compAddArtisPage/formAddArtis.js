import { useState } from "react";
import { useMutation } from "react-query";
import { API } from "../config/api";
import iconDropdown from "../src-assets/image/icon-dropdown-2.svg";

function CompFormAddArtis() {
  const api = API();

  // Form handler
  const [dataForm, setDataForm] = useState({
    name: "",
    old: "",
    type: "",
    startCareer: ""
  });

  // Message add artis handler
  const [message, setMessage] = useState(null);
  const generateMessage = (msg, type) => {
    // type : failed (red), success (green)
    return (
      <>
        {type === "success" ?
          <div className="w-full py-2 text-center bg-green-200 text-green-900 rounded-md mb-3">
            {msg}
          </div>
          :
          <div className="w-full py-2 text-center bg-red-200 text-red-900 rounded-md mb-3">
            {msg}
          </div>
        }
      </>
    );
  }

  const onChangeHandler = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
    });
  };

  const onSubmitHandler = useMutation(async (event) => {
    event.preventDefault();

    try {
      const reqBody = JSON.stringify(dataForm);

      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: reqBody
      }

      const response = await api.post("/artis", config);

      if (response.status === "failed") {
        setMessage(generateMessage(
          response.message,
          "failed"
        ));
      }
      if (response.status === "success") {
        setMessage(generateMessage(
          `Artis: ${dataForm.name}, successfully has been added`,
          "success"
        ));
      }

    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className='flex flex-row justify-center py-16 w-full'>
      <div className='flex flex-col h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-36'>
        <div className="text-2xl font-bold mb-10 mt-8 text-white">
          Add Artis
        </div>
        {message && message}
        <form
          onSubmit={(e) => onSubmitHandler.mutate(e)}
          className="flex flex-col w-full"
        >
          <input
            className="mb-5 border-2 border-gray-ds-10 rounded-md p-1 bg-gray-ds-20 text-white"
            name="name"
            type="text"
            placeholder="Name"
            value={dataForm.name}
            onChange={onChangeHandler}
            required
          />
          <input
            className="mb-5 border-2 border-gray-ds-10 rounded-md p-1 bg-gray-ds-20 text-white"
            name="old"
            type="number"
            placeholder="Old"
            value={dataForm.old}
            onChange={onChangeHandler}
            required
          />
          <div className="w-full mb-5 border-2 border-gray-ds-10 rounded-md overflow-hidden">
            <select
              name="type"
              className="invalid:text-gray-400 bg-no-repeat w-full border-r-8 border-transparent bg-right appearance-none text-white p-1 bg-gray-ds-20"
              style={{
                backgroundImage: `url(${iconDropdown})`
              }}
              onChange={onChangeHandler}
              value={dataForm.type}
              required
            >
              <option value="" disabled className="text-white">Type</option>
              <option value="solo">Solo</option>
              <option value="band">Band</option>
            </select>
          </div>
          <input
            className="mb-6 border-2 border-gray-ds-10 rounded-md p-1 bg-gray-ds-20 text-white"
            name="startCareer"
            type="text"
            pattern="[\d]{4}"
            placeholder="Start a Career"
            value={dataForm.startCareer}
            onChange={onChangeHandler}
            required
          />
          <div className="flex flex-row justify-center">
            <button type='submit' className="bg-orange-ds-100 hover:bg-orange-ds-200 text-sm font-semibold text-white py-1.5 px-24 rounded-lg">
              Add Artis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompFormAddArtis;