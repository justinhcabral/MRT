import { addStation, getStations } from "@/actions/station-actions";

//async server component
export default async function StationPage() {
  const stations = await getStations();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Station Management</h1>

      <form action={addStation} className="mb-8 p-4 border rounded bg-gray-50">
        <div className="grid gird-cols-2 gap-4">
          <input
            name="name"
            placeholder="Station Name"
            className="border p-2"
          />
        </div>
      </form>
    </div>
  );
}
