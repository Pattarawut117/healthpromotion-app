import React from 'react';
import { Flex, Progress } from 'antd';

export default function LinearGauge() {
  return (
    <div>
      <Flex gap="small" vertical>
        <Progress percent={70} status="active" />
      </Flex>
    </div>
  )
}
