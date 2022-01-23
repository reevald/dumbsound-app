import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";
import iconDropdown from "../src-assets/image/icon-dropdown-2.svg";
import iconAttach from "../src-assets/image/icon-attach.svg";

function CompFormAddMusic() {
  const api = API();

  // List artis name for select box
  const { data: listArtisName } = useQuery("getAllArtisName", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }

    const response = await api.get("/all-artis-name", config);
    if (response.status === "success") return response.data;
    if (response.status === "failed") return null;
  });

  // Form handler
  const [dataForm, setDataForm] = useState({
    title: "",
    year: "",
    thumbnail: "",
    attache: "",
    artisId: ""
  });

  // Message add music handler
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState({
    image: null,
    music: null
  });
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
      if (e.target.name === "thumbnail") {
        setPreview({
          ...preview,
          image: URL.createObjectURL(e.target.files[0]) // image as base64
        });
      }
      if (e.target.name === "attache") {
        setPreview({
          ...preview,
          music: e.target.files[0].name
        });
      }
    }
  };

  const onSubmitHandler = useMutation(async (event) => {
    event.preventDefault();

    try {
      // ref: https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
      const formData = new FormData();
      formData.append("title", dataForm.title);
      formData.append("year", dataForm.year);
      formData.append("thumbnail", dataForm.thumbnail[0]);
      formData.append("attache", dataForm.attache[0]);
      formData.append("artisId", dataForm.artisId);

      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      }

      const response = await api.post("/music", config);

      if (response.status === "failed") {
        setMessage(generateMessage(
          response.message,
          "failed"
        ));
      }
      if (response.status === "success") {
        setMessage(generateMessage(
          `Music: ${dataForm.title}, successfully has been added`,
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
          Add Music
        </div>
        {message && message}
        <form
          onSubmit={(e) => onSubmitHandler.mutate(e)}
          className="flex flex-col w-full"
        >
          <div className="mb-5 flex flex-row">
            <div className="flex-1 mr-4">
              <input
                className="w-full border-2 border-gray-ds-10 rounded-md p-1 bg-gray-ds-20 text-white"
                name="title"
                type="text"
                placeholder="Title"
                value={dataForm.title}
                onChange={onChangeHandler}
                required
              />
            </div>
            <div className="flex flex-col items-center">
              <div>
                <label htmlFor="uploadImage">
                  <div className="flex flex-row items-center cursor-pointer border-2 border-gray-ds-10 rounded-md py-1 px-2 bg-gray-ds-20 hover:text-white text-gray-400">
                    <div className="mr-3">
                      Attach Thumbnail
                    </div>
                    <img className="h-6" src={iconAttach} alt="Icon Attach Thumbnail" />
                  </div>
                </label>
                <input
                  className="hidden"
                  id="uploadImage"
                  name="thumbnail"
                  type="file"
                  accept='image/png, image/gif, image/jpeg'
                  onChange={onChangeHandler}
                // required ref: https://stackoverflow.com/a/23215333
                />
              </div>
              {preview.image ?
                <img className="w-44 mt-2 rounded-lg object-cover" src={preview.image} alt="Preview Thumbnail Music" />
                :
                <></>
              }
            </div>
          </div>
          <input
            className="mb-5 border-2 border-gray-ds-10 rounded-md p-1 bg-gray-ds-20 text-white"
            name="year"
            type="text"
            placeholder="Year"
            pattern="[\d]{4}"
            value={dataForm.year}
            onChange={onChangeHandler}
            required
          />
          <div className="w-full mb-5 border-2 border-gray-ds-10 rounded-md overflow-hidden">
            <select
              name="artisId"
              className="invalid:text-gray-400 bg-no-repeat w-full border-r-8 border-transparent bg-right appearance-none text-white p-1 bg-gray-ds-20"
              style={{
                backgroundImage: `url(${iconDropdown})`
              }}
              onChange={onChangeHandler}
              value={dataForm.artisId}
              required
            >
              <option value="" disabled className="text-white">Singer</option>
              {
                listArtisName?.map((dataArtis, index) => (
                  <option key={index} value={dataArtis.id}>{dataArtis.name}</option>
                ))
              }
            </select>
          </div>
          <div className="flex flex-row items-center mb-6">
            <label htmlFor="uploadMusic">
              <div className="cursor-pointer mr-4 border-2 border-gray-ds-10 rounded-md py-1 px-4 bg-gray-ds-20 hover:text-white text-gray-400">
                Attache
              </div>
            </label>
            <div className="flex-1 text-gray-ds-10">
              {preview.music && preview.music}
            </div>
          </div>
          <input
            className="hidden"
            id="uploadMusic"
            name="attache"
            type="file"
            accept='audio/mpeg, audio/wav'
            onChange={onChangeHandler}
          // required ref: https://stackoverflow.com/a/23215333
          />
          <div className="flex flex-row justify-center">
            <button type='submit' className="bg-orange-ds-100 hover:bg-orange-ds-200 text-sm font-semibold text-white py-1.5 px-24 rounded-lg">
              Add Song
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompFormAddMusic;