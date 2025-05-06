import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

const SignoutDialog = ({ open, handleDialog, handleSignOut }) => {
  return (
    <Dialog open={open} onClose={handleDialog}>
      <div className="text-center font-normal p-2 md:p-5 w-[60vw] md:w-[35vw]">
        <div className="text-lg md:text-2xl mb-4 md:mb-6">
          Are you sure you want to sign out?
        </div>
        <DialogActions>
          <div
            onClick={handleSignOut}
            className="bg-[#bebcbc] text-gray-700 text-sm md:text-lg w-24 p-2 hover:text-white rounded-sm hover:bg-red-700 transition ease-in-out delay-75 cursor-pointer"
          >
            Sign out
          </div>
          <div
            onClick={handleDialog}
            className="bg-[#bebcbc] text-gray-700 text-sm md:text-lg w-24 p-2 hover:text-white rounded-sm hover:bg-[#1e1d1d] transition ease-in-out delay-75 cursor-pointer"
          >
            Cancel
          </div>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default SignoutDialog;
