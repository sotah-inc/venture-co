import { CHANGE_IS_DELETE_POST_DIALOG_OPEN, CHANGE_POST, PostsActions } from "../actions/posts";
import { defaultPostsState, IPostsState } from "../types/posts";
import { runners } from "./handlers";

type State = Readonly<IPostsState>;

export function posts(state: State | undefined, action: PostsActions): State {
  if (typeof state === "undefined") {
    return defaultPostsState;
  }

  switch (action.type) {
  case CHANGE_POST:
    return { ...state, currentPost: action.payload };
  case CHANGE_IS_DELETE_POST_DIALOG_OPEN:
    return {
      ...state,
      currentPost: action.payload.post,
      isDeletePostDialogOpen: action.payload.isOpen,
    };
  default:
    return runners.post(state, action);
  }
}
