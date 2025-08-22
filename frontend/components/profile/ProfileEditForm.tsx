import { UpdateProfileRequest } from "@/types/user";

interface Props {
  formData: UpdateProfileRequest;
  setFormDataHandle: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm: React.FC<Props> = ({
  formData,
  setFormDataHandle,
  onSave,
  onCancel,
}) => {
  return (
    <div className="space-y-3">
      {/* Top-level fields */}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={setFormDataHandle}
        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
      />

      {/* Address fields */}
      {(
        ["line1", "line2", "city", "state", "postalCode", "country"] as const
      ).map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={
            formData && formData.address && formData.address[field]
              ? formData.address[field]
              : ""
          }
          onChange={setFormDataHandle} // just pass the event
          className="w-full border px-3 py-2 rounded"
        />
      ))}

      {/* Gender */}
      <select
        name="gender"
        value={formData.gender}
        onChange={setFormDataHandle}
        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      {/* BirthDate */}
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate?.split("T")[0] || ""}
        onChange={setFormDataHandle}
        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={onSave}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
