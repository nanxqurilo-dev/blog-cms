"use client";

import { useEffect, useState } from "react";

const TABS = ["General", "Display Defaults", "Comments", "Privacy & Legal"];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [openPasswordModal, setOpenPasswordModal] = useState(false);


  const [settings, setSettings] = useState<any>({
    language: "",
    timezone: "",
    dateformat: "",
    showAuthorName: false,
    showpublishDate: false,
    // showReadingTime: false, // ✅ ADD THIS
    theme: "light", // ✅ ADD THIS


    cookieConsentEnabled: false,
    privacyPolicyUrl: "",
  });
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("cms_token");

      const res = await fetch(`${API_BASE_URL}/api/admin/default-setting`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error("Error fetching settings", err);
    }
  };



  const updateSettings = async () => {
    try {
      const token = localStorage.getItem("cms_token");

      if (!token) {
        alert("Authentication token missing ❌");
        return;
      }

      const payload = {
        ...settings,
        timezone: "UTC", // ✅ FIX format
        cookieConsentVersion: "1.0",
        cookieConsentExpiryDays: 365,
        cookieConsentBannerText:
          "We use cookies to enhance your experience.",
        showCookieRejectButton: false,
      };

      const res = await fetch(`${API_BASE_URL}/api/admin/default-setting`, {
        method: "PUT", // ⚠️ if still fails → change to PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });




      const data = await res.json();

      console.log("UPDATE RESPONSE 👉", data);

      if (res.ok) {
        alert("✅ Settings saved successfully!");
      } else {
        alert(data?.message || "Failed to update settings ❌");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("Something went wrong ❌");
    }
  };




  // ✅ 4. useEffect (👇 PASTE HERE)
  useEffect(() => {
    fetchSettings();
  }, []);


  // // ✅ ADD THIS HERE (right below fetchSettings useEffect)
  // useEffect(() => {
  //   if (settings.theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [settings.theme]);

  return (
    <div className="min-h-screen bg-white p-6">


      {/* Header */}


      {/* Tabs */}
      <div className="flex gap-20 border-b mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>




      {activeTab === "General" && (
        <General
          settings={settings}
          setSettings={setSettings}
          updateSettings={updateSettings}
          onChangePassword={() => setOpenPasswordModal(true)}
        />
      )}



      {activeTab === "Comments" && <Comments />}

      {activeTab === "Display Defaults" && (
        <DisplayDefaults
          settings={settings}
          setSettings={setSettings}
          updateSettings={updateSettings}
        />
      )}

      {activeTab === "Privacy & Legal" && (
        <PrivacyLegal
          settings={settings}
          setSettings={setSettings}
          updateSettings={updateSettings}
        />
      )}
      {/* Change Password Modal */}
      {openPasswordModal && (
        <ChangePasswordModal onClose={() => setOpenPasswordModal(false)} />
      )}
    </div>
  );
}

/* ------------------ UI Helpers ------------------ */


function Card({ title, desc, children }: any) {
  return (
    <div
      className={`border rounded-xl p-6 max-w-8xl mb-6 ${title
        ? "bg-white text-black"
        : ""
        } ${
        // dark mode
        "dark:bg-gray-800 dark:text-white"
        }`}
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{desc}</p>
      {children}
    </div>
  );
}


function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-100 rounded-md px-4 py-2 text-sm w-full outline-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}



function Toggle({ value = false, onChange = () => { } }: any) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`w-10 h-6 rounded-full relative cursor-pointer ${value ? "bg-blue-600" : "bg-gray-300"
        }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition ${value ? "right-1" : "left-1"
          }`}
      />
    </div>
  );
}





function SaveButton({ onClick }: any) {
  return (
    <div className="max-w-8xl flex justify-end">
      <button
        onClick={onClick}
        className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm"
      >
        Save Changes
      </button>
    </div>
  );
}



/* ------------------ General ------------------ */


function General({
  onChangePassword,
  settings,
  setSettings,
  updateSettings,
}: any) {


useEffect(() => {
  const stored = localStorage.getItem("admin_profile");

  if (stored) {
    const data = JSON.parse(stored);

    setForm({
      username: data.username || "",
      phone: data.phone || "",
      email: data.email || "",
      admin_profile: null,
      preview: data.profile_Image || "",
    });
  }
}, []);



  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    admin_profile: null as File | null,
    preview: "",
  });

  const [updating, setUpdating] = useState(false);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleChange("admin_profile", file);

    // preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("preview", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // const handleSubmit = () => {
  //   console.log("FORM DATA 👉", form);

  //   // ⚡ later you will send FormData API here
  // };




//   const handleSubmit = async () => {
//   try {
//     const token = localStorage.getItem("cms_token");

//     if (!token) {
//       alert("Token missing ❌");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("username", form.username);
//     formData.append("phone", form.phone);
//     formData.append("email", form.email);

//     if (form.admin_profile) {
//       formData.append("admin_profile", form.admin_profile);
//     }

//     const res = await fetch(
//       `${API_BASE_URL}/app/auth/admin/update-profile`,
//       {
//         method: "PUT", // or POST (check API)
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       alert("✅ Profile updated!");

//       // ✅ SAVE UPDATED DATA IN LOCAL STORAGE
//       localStorage.setItem("admin_profile", JSON.stringify(data.admin));

//       // ✅ Trigger global update
//       window.dispatchEvent(new Event("profileUpdated"));

//     } else {
//       alert(data.message || "Update failed ❌");
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };








const handleSubmit = async () => {
  try {
    setUpdating(true); // ✅ start loading

    const token = localStorage.getItem("cms_token");

    if (!token) {
      alert("Token missing ❌");
      return;
    }

    const formData = new FormData();

    formData.append("username", form.username);
    formData.append("phone", form.phone);
    formData.append("email", form.email);

    if (form.admin_profile) {
      formData.append("admin_profile", form.admin_profile);
    }

    const res = await fetch(
      `${API_BASE_URL}/app/auth/admin/update-profile`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("✅ Profile updated!");

      localStorage.setItem("admin_profile", JSON.stringify(data.admin));

      window.dispatchEvent(new Event("profileUpdated"));
    } else {
      alert(data.message || "Update failed ❌");
    }
  } catch (err) {
    console.error(err);
  } finally {
    setUpdating(false); // ✅ stop loading
  }
};






  return (
    <>


      <Card
        title="Profile Settings"
        desc="Manage your account profile information."
      >
        <div className="space-y-6">

          {/* Profile Upload */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Profile Picture</p>

            <div className="flex items-center gap-4">
              <div className="relative">
                {form.preview ? (
                  <img
                    src={form.preview}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                    👤
                  </div>
                )}

                <label className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center cursor-pointer">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded-md text-sm cursor-pointer">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, JPEG
                </p>
              </div>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Enter username"
              className="w-full mt-1 bg-gray-100 rounded-md px-4 py-2 text-sm outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone number"
              className="w-full mt-1 bg-gray-100 rounded-md px-4 py-2 text-sm outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email"
              className="w-full mt-1 bg-gray-100 rounded-md px-4 py-2 text-sm outline-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            {/* <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm"
            >
              Update
            </button> */}


<button
  onClick={handleSubmit}
  disabled={updating}
  className={`px-6 py-2 rounded-md text-sm text-white ${
    updating
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {updating ? "Updating..." : "Update"}
</button>




          </div>
        </div>
      </Card>




      <Card
        title="System Defaults"
        desc="These settings are used when new blogs are created. Safe to change anytime."
      >

        <div>
          <label className="text-sm text-gray-600">Default Language</label>
          <Select
            value={settings.language}
            options={["English", "Hindi", "Spanish", "French"]}
            onChange={(val) =>
              setSettings({ ...settings, language: val })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Default Timezone</label>
          <Select
            value={settings.timezone}
            options={[
              "UTC",
              "Asia/Kolkata",
              "America/New_York",
              "Europe/London",
            ]}
            onChange={(val) =>
              setSettings({ ...settings, timezone: val })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Date Format</label>
          <Select
            value={settings.dateformat}
            options={[
              "MM/DD/YYYY",
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]}
            onChange={(val) =>
              setSettings({ ...settings, dateformat: val })
            }
          />
        </div>



      </Card>

      {/* <SaveButton /> */}
      <SaveButton onClick={updateSettings} />
    </>
  );
}

/* ------------------ Change Password Modal ------------------ */

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[420px] p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Current Password</label>
            <input
              type="password"
              className="w-full mt-1 bg-gray-100 rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">New Password</label>
            <input
              type="password"
              className="w-full mt-1 bg-gray-100 rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full mt-1 bg-gray-100 rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Other Tabs ------------------ */

function DisplayDefaults({ settings, setSettings, updateSettings }: any) {
  return (
    <>
      <Card
        title="Display Defaults"
        desc="Global defaults for reader experience. Can be overridden per post."
      >
        <div className="space-y-6">


          <Row
            title="Show Author Name"
            desc="Display author name on blog posts"
            value={settings.showAuthorName}
            onChange={(val: boolean) =>
              setSettings({ ...settings, showAuthorName: val })
            }
          />

          <Row
            title="Show Publish Date"
            desc="Display publication date on posts"
            value={settings.showpublishDate}
            onChange={(val: boolean) =>
              setSettings({ ...settings, showpublishDate: val })
            }
          />



          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-gray-500">
                Switch between light and dark mode
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs">☀️</span>

              <Toggle
                value={settings.theme === "dark"}
                onChange={(val: boolean) =>
                  setSettings({
                    ...settings,
                    theme: val ? "dark" : "light",
                  })
                }
              />

              <span className="text-xs">🌙</span>
            </div>
          </div>

        </div>
      </Card>
      {/* <SaveButton /> */}

      <SaveButton onClick={updateSettings} />
    </>
  );
}




function Row({ title, desc, value, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>

      <Toggle value={value} onChange={onChange} />
    </div>
  );
}




type Comment = {
  _id: string;
  name: string;
  text: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string; // ✅ add this

  };
};

function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);


  const fetchComments = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("cms_token"); // ✅ get token

      if (!token) {
        console.error("No token found ❌");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/comment/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ VERY IMPORTANT
        },
      });

      const data = await res.json();

      console.log("API RESPONSE 👉", data);

      if (data?.success) {
        // const filtered = data.data.filter((c: any) => !c.isDeleted);
        // setComments(filtered);


        const formatted = data.data
          .filter((c: any) => !c.isDeleted)
          .map((c: any) => ({
            _id: c._id,
            text: c.text,
            createdAt: c.createdAt,
            userId: {
              _id: c.userId?._id,
              name: c.userId?.name || "Unknown User",
              email: c.userId?.email || "No Email", // ✅ fallback
              profileImage: c.userId?.profileImage,
            },
          }));

        setComments(formatted);




      } else {
        console.error("API Error:", data.message);
      }
    } catch (err) {
      console.error("Error fetching comments", err);
    } finally {
      setLoading(false);
    }
  };


  const deleteComment = async (id: string) => {
    try {
      const token = localStorage.getItem("cms_token");

      if (!token) {
        alert("Token missing ❌");
        return;
      }

      const confirmDelete = confirm("Are you sure you want to delete this comment?");
      if (!confirmDelete) return;

      const res = await fetch(`${API_BASE_URL}/api/comment/delete/${id}`, {
        method: "DELETE", // ✅ adjust if your API uses POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.success) {
        // ✅ remove from UI instantly
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(data.message || "Delete failed ❌");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };





  return (
    <>
      <Card
        title="User Testimonials"
        desc="What users are saying about your blogs."
      >
        {loading ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments found.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 flex gap-4 items-start bg-gray-50"
              >



                {item.userId?.profileImage ? (
                  <img
                    src={item.userId.profileImage}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
                    {item.userId?.name?.charAt(0) || "U"}
                  </div>
                )}



                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">
                        {item.userId?.name}
                      </p>


                      <p className="text-xs text-gray-500">
                        {item.userId?.email || "No Email"}
                      </p>


                    </div>


                    <div>



                      {/* DELETE ICON */}
                      <button
                        onClick={() => deleteComment(item._id)}
                        className="text-red-500 mt-4 hover:text-red-700 text-sm"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                  {/* Comment */}
                  <p className="text-sm text-gray-700 mt-2">
                    {item.text}
                  </p>

                  {/* Extra Info */}
                  <p className="text-xs text-gray-400 mt-2">
                    User ID: {item.userId?._id}
                  </p>
                </div>

                <p className="text-xs mt-4 text-gray-400">
                  {/* {new Date(item.createdAt).toLocaleDateString()} */}
                  {new Date(item.createdAt).toLocaleString()}
                </p>

              </div>
            ))}
          </div>
        )}
      </Card>

      <SaveButton />
    </>
  );
}



function PrivacyLegal({ settings, setSettings, updateSettings }: any) {
  return (
    <>
      <Card
        title="Privacy & Legal"
        desc="Platform-wide settings with no per-blog overrides."
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cookie Consent Banner</p>
              <p className="text-xs text-gray-500">
                Show cookie consent notice to visitors
              </p>
            </div>
            {/* <Toggle /> */}

            <Toggle
              value={settings.cookieConsentEnabled}
              onChange={(val: boolean) =>
                setSettings({ ...settings, cookieConsentEnabled: val })
              }
            />

          </div>

          <div>
            <label className="text-sm text-gray-600">
              Privacy Policy Page URL
            </label>


            <input
              value={settings.privacyPolicyUrl}
              onChange={(e) =>
                setSettings({ ...settings, privacyPolicyUrl: e.target.value })
              }
              className="bg-gray-100 rounded-md px-4 py-2 text-sm w-full"
            />


          </div>
        </div>
      </Card>

      {/* <SaveButton /> */}
      <SaveButton onClick={updateSettings} />
    </>
  );
}
