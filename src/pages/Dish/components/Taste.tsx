import { ProFormText } from '@ant-design/pro-components';
import { Button, Form, Select } from 'antd';
import { FC } from 'react';

const { Option } = Select;
interface Flavor {
  name: string;
  value: string[];
  showOption?: boolean;
}

interface TasteProps {
  num?: number;
  handleAdd?: (num: number, f: Flavor) => void;
  handleDelete?: (num: number) => void;
  item?: Flavor;
  handleTagChange?: (num: number, tag: string) => void;
}

const Taste: FC<TasteProps> = ({ num, handleAdd, handleDelete, item, handleTagChange }) => {
  const handleTagRemoval = (num: number, tag: string) => {
    if (handleTagChange) {
      handleTagChange(num, tag);
    }
  };

  const createNewFlavor = (value: string): Flavor => {
    if (Number(value) === 1) {
      return {
        name: '甜味',
        value: ['无糖', '少糖', '半糖', '多糖', '全糖'],
        showOption: false,
      };
    } else if (Number(value) === 2) {
      return {
        name: '温度',
        value: ['热饮', '常温', '去冰', '少冰', '多冰'],
        showOption: false,
      };
    } else if (Number(value) === 3) {
      return {
        name: '忌口',
        value: ['不要葱', '不要蒜', '不要香菜', '不要辣'],
        showOption: false,
      };
    } else {
      return {
        name: '辣度',
        value: ['不辣', '微辣', '中辣', '重辣'],
        showOption: false,
      };
    }
  };

  const handleChangeTaste = (value: string) => {
    const newFlavor: Flavor = createNewFlavor(value);
    if (handleAdd && num !== undefined) {
      handleAdd(num, newFlavor);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        label="口味做法配置"
        name="taste"
        rules={[
          {
            required: true,
            message: '口味做法配置为必填项',
          },
        ]}
      >
        <Select
          style={{ width: '150px' }}
          onChange={(value) => {
            handleChangeTaste(value);
          }}
          defaultValue={item?.name}
        >
          <Option value="1">甜味</Option>
          <Option value="2">温度</Option>
          <Option value="3">忌口</Option>
          <Option value="4">辣度</Option>
        </Select>
      </Form.Item>
      <ProFormText width="md">
        {item?.value?.map((tag, tagIndex) => (
          <span
            key={tagIndex}
            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '5px 15px' }}
            onClick={() => handleTagRemoval(num, tag)}
          >
            {tag}{' '}
            <span
              style={{ fontWeight: 'bold', marginLeft: '5px' }}
              onClick={() => handleTagRemoval(num, tag)}
            >
              X
            </span>
          </span>
        ))}
      </ProFormText>
      <Button
        style={{ color: 'red' }}
        onClick={() => (handleDelete && num !== undefined ? handleDelete(num) : undefined)}
      >
        删除
      </Button>
    </div>
  );
};

export default Taste;
