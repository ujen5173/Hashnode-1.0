import Anouncement from "./Anouncement";
import Drafts from "./Drafts";
import Bookmarks from "./Bookmarks";
import Others from "./Others";
import Trending from "./Trending";

const RightAsideMain = () => {
  return (
    <aside className="container-right-aside my-4 hidden min-h-screen lg:block">
      <Anouncement />
      <Trending />
      <Drafts />
      <Bookmarks />
      <Others />
    </aside>
  );
};

export default RightAsideMain;
