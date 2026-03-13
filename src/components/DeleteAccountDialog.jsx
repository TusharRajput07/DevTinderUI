import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

const DeleteAccountDialog = ({ open, handleDialog, handleDeleteAccount }) => {
  return (
    <Dialog open={open} onClose={handleDialog}>
      <div className="text-center p-2 md:p-5 w-[80vw] md:w-[35vw]">
        <div className="text-2xl md:text-2xl mb-2 md:mb-4">
          Are you sure you want to delete your account?
        </div>
        <div className="text-sm text-gray-500 mb-4">
          This action is permanent and cannot be undone.
        </div>
        <DialogActions>
          <div
            onClick={handleDeleteAccount}
            className="bg-[#bebcbc] text-gray-700 text-lg w-24 p-2 hover:text-white rounded-4xl hover:bg-red-700 transition ease-in-out delay-75 cursor-pointer"
          >
            Delete
          </div>
          <div
            onClick={handleDialog}
            className="bg-[#bebcbc] text-gray-700 text-lg w-24 p-2 hover:text-white rounded-4xl hover:bg-[#1e1d1d] transition ease-in-out delay-75 cursor-pointer"
          >
            Cancel
          </div>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default DeleteAccountDialog;
