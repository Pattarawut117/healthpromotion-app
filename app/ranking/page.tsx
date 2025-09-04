import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Segmented } from "antd";
import RankTable from "@/components/ranking/RankTable";

export default function RankingPage() {
  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <h1 className="text-lg font-bold">จัดอันดับการวิ่ง</h1>
        <div>
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
              ]}
            />
          </Flex>
        </div>
      </div>
        <RankTable/>
    </div>
  );
}
