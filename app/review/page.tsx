import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Segmented } from "antd";

export default function ReviewPage() {
  return (
    <div className="flex flex-col p-2 justify-center">
      <div className="flex justify-between px-2 py-2 items-center">
        <p className="text-xl font-bold font-sans">คำแนะนำ</p>
        <select className="flex px-2 py-2 rounded bg-white">
          <option value="กิจกรรมทั้งหมด">กิจกรรมทั้งหมด</option>
          <option value="กิจกรรมแคมเปญ">กิจกรรมแคมเปญ</option>
        </select>
      </div>
      <div className="flex justify-around">
        <Flex gap="small" align="flex-end" vertical>
          <Segmented
            options={[
              {
                label: (
                  <div style={{ padding: 4 }}>
                    <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                  </div>
                ),
                value: "user1",
              },
              {
                label: (
                  <div style={{ padding: 4 }}>
                    <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
                  </div>
                ),
                value: "user2",
              },
              {
                label: (
                  <div style={{ padding: 4 }}>
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                  </div>
                ),
                value: "user3",
              },
              {
                label: (
                  <div style={{ padding: 4 }}>
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                  </div>
                ),
                value: "user4",
              },
              {
                label: (
                  <div style={{ padding: 4 }}>
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                  </div>
                ),
                value: "user5",
              },
            ]}
          />
        </Flex>
      </div>
    </div>
  );
}
