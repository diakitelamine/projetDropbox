import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOADDER_FILE } from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      
      return { ...state, loginSuccess: action.payload };

    case REGISTER_USER:
      return { ...state, registerSucess: action.payload };

    case AUTH_USER:
      return { ...state, userData: action.payload };

      case LOADDER_FILE:
      return { ...state, userData: action.payload };

    default:
      return state;
  }
}
