import { connect } from "react-redux";

import { ChangeIsWorkOrderDialogOpen } from "../../../actions/work-order";
import { IDispatchProps, WorkOrdersButton } from "../../../components/App/Topbar/WorkOrdersButton";

const mapDispatchToProps: IDispatchProps = {
  changeIsWorkOrderDialogOpen: ChangeIsWorkOrderDialogOpen,
};

export const WorkOrdersButtonContainer = connect<{}, IDispatchProps>(
  null,
  mapDispatchToProps,
)(WorkOrdersButton);
