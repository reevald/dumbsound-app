import { useQuery } from "react-query";
import { API } from "../config/api";
import { useState, useContext } from "react";
import { UserContext } from '../context/authContext';
import { useHistory } from "react-router-dom";
import { baseUploadImg, baseUploadMusic } from "../config/basePath";
import ReactJkMusicPlayer from "react-jinke-music-player";
import 'react-jinke-music-player/assets/index.css'

function CompListPlayMusic() {
  const api = API();
  const history = useHistory();
  const [playIndex, setPlayIndex] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [stateUser,] = useContext(UserContext);
  const statusSub = stateUser.user.statusSub;

  const cardMusicHandler = (idx) => {
    if (statusSub === "Active") {
      return setPlayIndex(idx);
    } else {
      return history.push("/subscribe");
    }
  }

  const { data: listMusic } = useQuery("getListMusic", async () => {
    const config = {
      method: "GET"
    }

    const response = await api.get("/musics", config);
    if (response.status === "success") {
      setPlaylist(response.data.map((dataMusic) => {
        return {
          name: dataMusic.title,
          singer: dataMusic.artis.name,
          cover: baseUploadImg(dataMusic.thumbnail),
          musicSrc: baseUploadMusic(dataMusic.attache)
        }
      }));
      return response.data;
    }
    if (response.status === "failed") return null;
  });

  return (
    <>
      <div className="w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-16">
        <div className="w-full items-center flex flex-col py-16">
          <div id="section-playlist" className="font-semibold text-orange-ds-200 xl:text-xl mb-12">
            Dengarkan Dan Rasakan
          </div>
          <div className="grid grid-cols-6 gap-3 xl:gap-4">
            {listMusic?.map((dataMusic, index) => (
              <div key={index}
                onClick={() => cardMusicHandler(index)}
                className="cursor-pointer flex flex-col bg-gray-ds-100 hover:bg-gray-ds-200 p-2 xl:p-3 rounded-lg">
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
      {(statusSub === "Active") ?
        <ReactJkMusicPlayer
          mode="full"
          audioLists={playlist}
          defaultPlayIndex={0}
          autoPlay={false}
          showDownload={false}
          showReload={false}
          showThemeSwitch={false}
          toggleMode={false}
          responsive={false}
          playIndex={playIndex}
        />
        :
        null
      }
    </>
  );
}

export default CompListPlayMusic;