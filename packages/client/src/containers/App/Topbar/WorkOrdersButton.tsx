import { connect } from "react-redux";

import { ChangeIsWorkOrderDialogOpen } from "../../../actions/work-order";
import {
  IDispatchProps,
  IOwnProps,
  WorkOrdersButton,
} from "../../../components/App/Topbar/WorkOrdersButton";

const mapDispatchToProps: IDispatchProps = {
  changeIsWorkOrderDialogOpen: ChangeIsWorkOrderDialogOpen,
};

export const WorkOrdersButtonContainer = connect<Record<string, unknown>, IDispatchProps, IOwnProps>(
  null,
  mapDispatchToProps,
)(WorkOrdersButton);
