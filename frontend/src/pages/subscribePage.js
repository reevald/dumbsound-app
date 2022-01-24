import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import { useContext, useCallback, useEffect, useState } from "react";
import { UserContext } from "../context/authContext";

import CompSubscribePayment from "../compSubscribePage/formSubscribe";
import CompNoticeActive from "../compSubscribePage/noticeActive";
import CompNoticePending from "../compSubscribePage/noticePending";

import CompLoadingFullScreen from '../component/loading';

import { API } from '../config/api';

function SubscribePage() {
  const [stateUser, dispatchUser] = useContext(UserContext);
  const [isCheckLoading, setIsCheckLoading] = useState(true);

  const checkUserLogin = useCallback(async () => {
    const api = API(); // inside scope checkUserLogin to avoid infinite loop
    // because every rander make api get update
    try {
      // Using bearer for jwt token (but bearer is only be used over https?)
      // ref: https://swagger.io/docs/specification/authentication/basic-authentication/
      // ref: https://swagger.io/docs/specification/authentication/bearer-authentication/
      // ref: https://stackoverflow.com/a/34022350
      const config = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.token
        }
      };
      const response = await api.get("/check-auth", config);
      setIsCheckLoading(false);

      // handle invalid token and error server
      if (response.status === "failed") {
        return dispatchUser({
          type: "AUTH_ERROR"
        });
      }

      if (response.status === "success") {
        return dispatchUser({
          type: "AUTH_SUCCESS",
          payload: response.data,
        });
      }

    } catch (error) {
      console.log(error);
    }
  }, [dispatchUser]);

  // Ref: https://reactjs.org/docs/hooks-effect.html
  // Avoid warning : "React Hook useEffect has a missing dependency blabla",
  // Ref: https://stackoverflow.com/a/60327893 (useCallback)
  useEffect(() => {
    console.log("running sub"); // for checking infinite loop
    checkUserLogin();
  }, [checkUserLogin]);

  if (isCheckLoading) {
    return (
      <CompLoadingFullScreen />
    );
  } else {
    return (
      <>
        <CompNavbar isFixedColorNav={true} />
        <CompWrapper>
          {(stateUser.user.statusSub === "Pending") ?
            <CompNoticePending />
            :
            (stateUser.user.statusSub === "Active") ?
              <CompNoticeActive remainDay={stateUser.user.remainDay} />
              :
              <CompSubscribePayment />
          }
        </CompWrapper>
        <CompFooter />
      </>
    );
  }
}

export default SubscribePage;