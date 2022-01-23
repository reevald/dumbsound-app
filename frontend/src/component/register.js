import { useContext, useState } from "react";
import { UserContext } from "../context/authContext";
import { ModalContext } from "../context/modalContext";
import { useHistory } from "react-router-dom";

import { useMutation } from "react-query";

import { API } from "../config/api";

import iconDropdown from "../src-assets/image/icon-dropdown-2.svg";

function CompRegister() {
  const history = useHistory();
  const api = API();

  const [, dispatchUser] = useContext(UserContext);
  const [stateModal, dispatchModal] = useContext(ModalContext);

  // Show modal login handler
  const openModalLogin = () => dispatchModal({ type: 'OPEN_MODAL_LOGIN' });
  // Show modal register handler
  const openModalRegister = () => dispatchModal({ type: 'OPEN_MODAL_REGISTER' });
  const closeModalRegister = () => dispatchModal({ type: 'CLOSE_MODAL' });

  // Form register handler
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
    fullName: "",
    gender: "",
    phone: "",
    address: "",
    listAs: "0"
  });

  // Message register handler
  const [message, setMessage] = useState(null);
  const generateMessage = (msg) => {
    return (
      <div className="w-full py-2 text-center bg-red-100 text-red-900 rounded-md mb-3">
        {msg}
      </div>
    );
  }

  const onChangeHandler = (event) => {
    setDataForm({
      ...dataForm,
      [event.target.name]: event.target.value,
    })
  };

  const onSubmitHandler = useMutation(async (event) => {
    event.preventDefault();

    // Data body
    const reqBody = JSON.stringify(dataForm);

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: reqBody
    }

    // Insert data to database
    const response = await api.post("/register", config);

    if (response.status === "success") {
      dispatchUser({
        type: 'LOGIN_SUCCESS',
        payload: response.data,
      });
      closeModalRegister();
      history.push('/');
    }

    if (response.status === "failed") {
      setMessage(generateMessage(
        response.message
      ));
      console.log(response);
      console.log("Login gagal");
    }
  });
  return (
    <>
      <div
        onClick={openModalRegister}
        className='cursor-pointer hover:bg-orange-ds-100 text-xs font-bold bg-orange-ds-200 px-4 py-1.5 text-white rounded-lg'>
        Register
      </div>

      {/* Modal register */}
      <div
        style={{
          display: stateModal.isOpenModalRegister,
        }}
        className="fixed inset-x-0 top-0 w-full h-screen flex flex-col justify-center items-center">
        <div
          className='flex-none fixed inset-x-0 top-0 h-screen bg-gray-900 bg-opacity-60'
          onClick={closeModalRegister}
        />
        <div className='z-10 bg-gray-ds-300 px-5 py-8 rounded-lg flex flex-col max-w-xs w-full'>
          <div className="text-white text-2xl font-bold mb-6">
            Register
          </div>
          {message && message}
          <form
            onSubmit={(e) => onSubmitHandler.mutate(e)}
            className="flex flex-col mb-3">
            <input
              className="mb-3 border-2 text-white border-gray-400 rounded-md p-1 bg-gray-500"
              name="email"
              type="email"
              placeholder="Email"
              value={dataForm.email}
              onChange={onChangeHandler}
              required
            />
            <input
              className="mb-3 border-2 text-white border-gray-400 rounded-md p-1 bg-gray-500"
              name="password"
              type="password"
              placeholder="Password"
              value={dataForm.password}
              autoComplete="new-password"
              onChange={onChangeHandler}
              required
            />
            <input
              className="mb-3 border-2 text-white border-gray-400 rounded-md p-1 bg-gray-500"
              name="fullName"
              type="text"
              placeholder="Full Name"
              pattern="[a-zA-Z .,'-]+"
              value={dataForm.fullName}
              onChange={onChangeHandler}
              required
            />
            <div className="w-full mb-3 border-2 border-gray-400 rounded-md overflow-hidden">
              <select
                name="gender"
                className="invalid:text-gray-400 bg-no-repeat w-full border-r-8 border-transparent bg-right  appearance-none text-white p-1 bg-gray-500"
                style={{
                  backgroundImage: `url(${iconDropdown})`
                }}
                onChange={onChangeHandler}
                value={dataForm.gender}
                required
              >
                <option value="" disabled className="text-white">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <input
              className="mb-3 border-2 text-white border-gray-400 rounded-md p-1 bg-gray-500"
              name="phone"
              type="text"
              placeholder="Phone: +62XXXXXXXXX"
              pattern="\+62[\d]{9,13}"
              value={dataForm.phone}
              onChange={onChangeHandler}
              required
            />
            <textarea
              className="mb-6 h-9 border-2 text-white border-gray-400 rounded-md p-1 bg-gray-500"
              name="address"
              placeholder="Address"
              value={dataForm.address}
              onChange={onChangeHandler}
              required
            />
            <button className="bg-orange-ds-200 hover:bg-orange-ds-100 text-white w-full py-2 rounded-lg" type="submit">
              Register
            </button>
          </form>
          <div className="text-white text-sm text-center">
            Already have an account? Click <b className="cursor-pointer hover:text-orange-ds-100" onClick={openModalLogin}>Here</b>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompRegister;