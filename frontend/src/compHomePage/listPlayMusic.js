import { useQuery } from "react-query";
import { API } from "../config/api";
import { baseUploadImg } from "../config/basePath";

function CompListPlayMusic() {
  const api = API();

  const { data: listMusic } = useQuery("getListMusic", async () => {
    const config = {
      method: "GET"
    }

    const response = await api.get("/musics", config);
    if (response.status === "success") return response.data;
    if (response.status === "failed") return null;
  });

  return (
    <div className="w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-16">
      <div className="w-full items-center flex flex-col py-8">
        <div className="font-semibold text-orange-ds-200 xl:text-xl mb-8">
          Dengarkan Dan Rasakan
        </div>
        <div className="grid grid-cols-6 gap-3 xl:gap-4">
          {listMusic?.map((dataMusic, index) => (
            <div key={index} className="cursor-pointer flex flex-col bg-gray-ds-100 hover:bg-gray-ds-200 p-2 xl:p-3 rounded-lg">
              <img className="mb-2 xl:mb-3 rounded-lg" src={baseUploadImg(dataMusic.thumbnail)} alt="Cover Music" />
              <div className="text-white flex flex-row w-full justify-between items-center">
                <div className="text-sm font-semibold mr-1 flex-1 truncate ...">{dataMusic.title}</div>
                <div className="text-xs">{dataMusic.year}</div>
              </div>
              <div className="text-xs text-white truncate ...">
                {dataMusic.artis.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompListPlayMusic;