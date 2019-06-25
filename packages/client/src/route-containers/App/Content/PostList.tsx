import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Content/PostList";
import { PostListContainer } from "../../../containers/App/Content/PostList";

export const PostListRouteContainer = withRouter<IOwnProps>(PostListContainer);
