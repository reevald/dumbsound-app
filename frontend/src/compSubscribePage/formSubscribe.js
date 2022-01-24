import { API } from "../config/api";
import { useContext, useState } from "react";
import { UserContext } from "../context/authContext";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import iconAttach from "../src-assets/image/icon-attach.svg";

function CompSubscribePayment(props) {
  const api = API();
  const history = useHistory();
  const [stateUser,] = useContext(UserContext);

  // Ref: https://stackoverflow.com/a/4929629
  const today = new Date();
  const ddStart = String(today.getDate()).padStart(2, '0');
  const mmStart = String(today.getMonth() + 1).padStart(2, '0');
  const yyyyStart = today.getFullYear();

  const durationSubscribe = 30 * 24 * 60 * 60 * 1000; // 30 days
  const dueDate = new Date(today.getTime() + durationSubscribe);
  const ddDue = String(dueDate.getDate()).padStart(2, '0');
  const mmDue = String(dueDate.getMonth() + 1).padStart(2, '0');
  const yyyyDue = dueDate.getFullYear();

  // Form handler
  const [dataForm, setDataForm] = useState({
    startDate: `${ddStart}/${mmStart}/${yyyyStart}`,
    dueDate: `${ddDue}/${mmDue}/${yyyyDue}`,
    userId: stateUser.user.id,
    status: "Pending",
    accountNumber: "",
    attache: ""
  });

  // Message add payment handler
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState(null);

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

    // Create image url for preview 
    // Reference : https://stackoverflow.com/a/43992687
    // Fix error : https://flutterq.com/typeerror-failed-to-execute-createobjecturl-on-url-overload-resolution-failed/
    if (e.target.type === 'file' && e.target.files.length !== 0) {
      // image as base64
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  const onSubmitHandler = useMutation(async (event) => {
    event.preventDefault();

    try {
      // ref: https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
      const formData = new FormData();
      formData.append("startDate", dataForm.startDate);
      formData.append("dueDate", dataForm.dueDate);
      formData.append("userId", dataForm.userId);
      formData.append("attache", dataForm.attache[0]);
      formData.append("status", dataForm.status);
      formData.append("accountNumber", dataForm.accountNumber);

      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      }

      const response = await api.post("/transaction", config);

      if (response.status === "failed") {
        setMessage(generateMessage(
          response.message,
          "failed"
        ));
      }
      if (response.status === "success") {
        return history.go(0);
      }

    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className='flex flex-row justify-center py-16 w-full'>
      <div className='flex flex-col items-center h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-36'>
        <div className="text-3xl font-bold mb-10 mt-16 text-white">
          Premium
        </div>
        <div className="text-white font-light mb-3">
          Bayar sekarang dan nikmati streaming music yang kekinian dari <span className="font-semibold"><span className="text-orange-ds-200">DUMB</span>SOUND</span>
        </div>
        <div className="mb-6">
          <span className="font-semibold text-white"><span className="text-orange-ds-200">DUMB</span>SOUND : 0981312323</span>
        </div>
        {message && message}
        <form
          onSubmit={(e) => onSubmitHandler.mutate(e)}
          className="flex flex-col w-full max-w-xs"
        >
          <input
            className="mb-5 border-2 border-gray-ds-10 rounded-md p-1 bg-gray-ds-20 text-white"
            name="accountNumber"
            type="text"
            placeholder="Input your account number"
            pattern="[\d]{8,11}"
            value={dataForm.accountNumber}
            onChange={onChangeHandler}
            required
          />
          <div className="mb-6">
            <label htmlFor="uploadImage">
              <div className="flex flex-row items-center cursor-pointer border-2 border-gray-ds-10 rounded-md py-1.5 px-2 hover:text-orange-ds-100 text-orange-ds-200 font-semibold">
                <div className="mr-3 flex-1">
                  Attach proof of transfer
                </div>
                <img className="h-6" src={iconAttach} alt="Icon Attach Thumbnail" />
              </div>
            </label>
            <input
              className="hidden"
              id="uploadImage"
              name="attache"
              type="file"
              accept='image/png, image/gif, image/jpeg'
              onChange={onChangeHandler}
            // required ref: https://stackoverflow.com/a/23215333
            />
          </div>
          {preview ? 
            <img className="w-full rounded-md object-cover" src={preview} alt="Preview Thumbnail Music" />
            :
            <></>
          }
          <div className="flex flex-row justify-center mt-6">
            <button type='submit' className="bg-orange-ds-100 hover:bg-orange-ds-200 text-sm font-semibold text-white py-2 w-full rounded-md">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompSubscribePayment;