// import { articles } from "~/utils/constants";
import { useState } from "react";
import { api } from "~/utils/api";
import ManageData from "./Cards/ManageData";
import ArticleLoading from "./Loading/ArticleLoading";
import MainBodyHeader from "./MainBodyHeader";

export interface Tag {
  id: string;
  name: string;
}

export interface FilterData {
  status: boolean;
  data: {
    read_time: "Over 5 min" | "5 min" | "Under 5 min" | null | undefined;
    tags: Tag[];
  };
}
const MainBodyArticles = () => {
  const [filter, setFilter] = useState<FilterData>({
    status: false,
    data: {
      read_time: null,
      tags: [],
    },
  });

  const read_time_options = [
    { label: "Under 5 min", value: "under_5" },
    { label: "5 min", value: "5" },
    { label: "Over 5 min", value: "over_5" },
  ];

  const [newFilterData, setNewFilterData] = useState<{
    read_time: "Over 5 min" | "5 min" | "Under 5 min" | null | undefined;
    tags: Tag[];
  }>({
    read_time: filter.data.read_time,
    tags: filter.data.tags,
  });

  const { data, isLoading } = api.posts.getAll.useQuery(
    {
      type: "personalized",
      filter: {
        tags: newFilterData.tags,
        read_time: newFilterData.read_time
          ? (read_time_options.find(
              (option) => option.label === newFilterData.read_time
            )?.value as "over_5" | "5" | "under_5" | null | undefined)
          : null,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const applyFilter = () => {
    setNewFilterData(filter.data);
  };

  const clearFilter = () => {
    setNewFilterData({
      read_time: null,
      tags: [],
    });
  };

  return (
    <section className="container-main my-4 min-h-screen w-full overflow-hidden rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <MainBodyHeader
        applyFilter={() => void applyFilter()}
        clearFilter={() => void clearFilter()}
        filter={filter}
        setFilter={setFilter}
      />

      <div>
        <ManageData
          loading={<ArticleLoading />}
          type="ARTICLE"
          articleData={{ data, isLoading }}
        />
      </div>
    </section>
  );
};

export default MainBodyArticles;
