import { Provider } from "react-redux";
import Body from "./components/Body";
import Footer from "./components/Footer";
import appStore from "./utils/appStore";

function App() {
  return (
    <Provider store={appStore}>
      <div>
        <Body />
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
