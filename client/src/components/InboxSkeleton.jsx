const InboxSkeleton = () => {
  return (
    <div className=" w-full mt-3">
      <div className=" w-full h-fit space-y-8 mb-5">
        <div className="space-y-2">
          <p className="skeleton bg-slate-200 h-9 w-1/2 rounded-lg"></p>
          <p className="skeleton bg-slate-200 h-9 w-[40%] rounded-lg"></p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <p className="skeleton bg-slate-200 h-9 w-[30%] rounded-lg"></p>
          <p className="skeleton h-9 bg-slate-200 w-1/2 rounded-lg"></p>
        </div>
        <div>
          <p className="skeleton bg-slate-200 h-9 w-1/2 rounded-lg"></p>
        </div>
      </div>
    </div>
  );
};

export default InboxSkeleton;
