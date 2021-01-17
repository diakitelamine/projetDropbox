import { combineReducers } from "redux";
import user from "./user_reducer";

// combine reducers of each features to one rootReducer
const rootReducer = combineReducers({
  user,
});

export default rootReducer;
