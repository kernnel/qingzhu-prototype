import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AlbumDetail from "./pages/AlbumDetail";
import UserCenterV2 from "./pages/UserCenterV2";
import OrderList from "./pages/OrderList";
import SettingsPage from "./pages/SettingsPage";
import ProfileEdit from "./pages/ProfileEdit";
import ReferFriend from "./pages/ReferFriend";
import ShareView from "./pages/ShareView";
import PhotographerProfile from "./pages/PhotographerProfile";
import MembershipPage from "./pages/MembershipPage";
import TestNav from "./pages/TestNav";
import ClientAlbumList from "./pages/ClientAlbumList";
import ClientShareView from "./pages/ClientShareView";
import AppSettings from "./pages/AppSettings";
import AlbumExpired from "./pages/AlbumExpired";
import WechatLogin from "./pages/WechatLogin";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={TestNav} />
      <Route path={"/home"} component={Home} />
      <Route path={"/album"} component={AlbumDetail} />
      <Route path={"/user-center"} component={UserCenterV2} />
      <Route path={"/orders"} component={OrderList} />
      <Route path={"/settings"} component={SettingsPage} />
      <Route path={"/profile-edit"} component={ProfileEdit} />
      <Route path={"/refer-friend"} component={ReferFriend} />
      <Route path={"/share"} component={ShareView} />
      <Route path={"/photographer"} component={PhotographerProfile} />
      <Route path={"/membership"} component={MembershipPage} />
      <Route path={"/client-albums"} component={ClientAlbumList} />
      <Route path={"/client-share"} component={ClientShareView} />
      <Route path={"/app-settings"} component={AppSettings} />
      <Route path={"/album-expired"} component={AlbumExpired} />
      <Route path={"/wechat-login"} component={WechatLogin} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
