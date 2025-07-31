// import Search from "./tools/search";
// import Add from "./tools/add";
import Refetch from "./tools/refetch";
import Edit from "./tools/edit";
import View from "./tools/view";
import Clean from "./tools/clean";
import Fields from "./tools/fields";
import Download from "./tools/download";
import Filter from "./tools/filter";
// import Delete from "./tools/delete";

const Tools = ({ tools, refetch, clean, detail, exporting }) => {
  return (
    <div className="flex w-full justify-between items-center px-4 bg-purple-500/0">
      {/* ACTIONS */}
      <div className="flex">
        {/* {tools.create && tools.create_btn && (
          <Add
            btn_title={tools.create_btn}
            route={tools.default_url.route}
            forms={tools.create}
          />
        )} */}
        <Refetch func={refetch} />
        {tools.edit && <Edit forms={[]} route={""} initial_data={undefined} />}

        <button onClick={detail} className="btn-r">
          <View />
        </button>

        {/* {tools.delete && <Delete />} */}
      </div>

      {/* STANDARD */}
      <div className="flex justify-end items-center flex-1">
        {/* <Search fields={tools.search} /> */}
        <Clean func={clean} />
        <Download func={exporting} />
        <Fields />
        {tools && <Filter tools={tools} />}
      </div>
    </div>
  );
};

export default Tools;
