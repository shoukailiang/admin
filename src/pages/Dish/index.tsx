import {
  addDishItem,
  getCategoryList,
  getDishItemById,
  updateDishItem,
} from '@/services/ant-design-pro/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Form, Input, message, Select, Spin, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Taste from './components/Taste';
const { Option } = Select;

interface Flavor {
  name: string;
  value: string[];
  showOption: boolean;
}
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const Dish: React.FC = () => {
  // 判断路由雨中是否有id
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const [categoryList, setCategoryList] = useState<{ [key: number]: string }>({});

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, () => {
        setLoading(false);
        setImageUrl(info.file.response.data);
      });
    }
  };
  // 所有的数据
  const [allflavors, setALLFlavors] = useState<Flavor[]>([
    // {name: '口味1', values: ['1', '2', '3']},
  ]);

  // useEffect(() => {
  //   console.log(allflavors);
  // }, [allflavors]);

  const { run, loading: loadingGetCategoryList } = useRequest(
    async () => {
      const { data } = await getCategoryList();
      return data;
    },
    {
      manual: true,
      onSuccess(res) {
        // 构建一个key是res.id，value是res.name的对象
        const categoryList: { [key: number]: string } = {};
        res.forEach((item: { id: number; name: string }) => {
          categoryList[item.id] = item.name;
        });
        setCategoryList(categoryList);
      },
    },
  );

  const [formName, setFormName] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formCategoryId, setFormCategoryId] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');

  useEffect(() => {
    run();
  }, []);

  const { run: getDishRun, loading: loadingGetDish } = useRequest(
    async (id: string) => {
      const { data } = await getDishItemById(id);
      return data;
    },
    {
      manual: true,
      onSuccess(res) {
        const transformedData = res.flavors.map((item: Flavor) => ({
          name: item.name,
          value: JSON.parse(item.value),
          showOption: item.showOption,
        }));
        setFormName(res.name);
        setImageUrl(res.image);
        setFormPrice(res.price);
        setFormCategoryId(res.categoryId);
        setFormDescription(res.description);
        setALLFlavors(transformedData);
      },
    },
  );

  useEffect(() => {
    // 更新数据
    if (id && id !== 'new') {
      getDishRun(id);
    }
  }, [id]);

  const handleAddTaste = () => {
    setALLFlavors([...allflavors, { name: '', value: [], showOption: false }]);
  };

  const handleDelete = (num: number) => {
    // 删除下标为num的数据
    const newFlavors = [...allflavors];
    newFlavors.splice(num, 1);
    setALLFlavors(newFlavors);
  };

  const handleAdd = (num: number, f: Flavor) => {
    // 修改下表为num的数据
    const newFlavors = [...allflavors];
    newFlavors[num] = f;
    setALLFlavors(newFlavors);
  };

  const handleTagChange = (num: number, tag: string) => {
    // 修改下标为num的数据
    const newFlavors = [...allflavors];
    const newFlavor = newFlavors[num];
    newFlavor.value = newFlavor.value.filter((item) => item !== tag);
    setALLFlavors(newFlavors);
  };

  // const handleImageChange = ({ file }) => {
  //   if (file.status !== 'uploading') {
  //     setImageUrl(file.response.data.url);
  //   }
  // };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const nav = useNavigate();

  const { run: submitDish } = useRequest(
    async (obj) => {
      const { data } = await addDishItem(obj);
      return data;
    },
    {
      manual: true,
      onSuccess() {
        //
        message.success('添加成功');
        nav('/dish/list');
      },
    },
  );

  const handleForm = (key: string, text: string) => {
    if (key === 'name') {
      setFormName(text);
    } else if (key === 'price') {
      setFormPrice(text);
    } else if (key === 'categoryId') {
      setFormCategoryId(text);
    } else if (key === 'description') {
      setFormDescription(text);
    }
  };

  const checkForm = () => {
    // 检查是否为空
    if (!formName) {
      message.error('菜品名称不能为空');
      return;
    }
    if (!formPrice) {
      message.error('菜品价格不能为空');
      return;
    }
    if (!formCategoryId) {
      message.error('菜品分类不能为空');
      return;
    }
    if (!imageUrl) {
      message.error('菜品图片不能为空');
      return;
    }
  };

  const handleSubmit = () => {
    checkForm();
    // 发送请求
    submitDish({
      name: formName,
      price: formPrice,
      categoryId: formCategoryId,
      // 这里需要吧allflavors中的values转换成字符串
      //   [{name: "甜味", value: "["无糖","少糖","半糖","多糖","全糖"]", showOption: false}]
      flavors: allflavors.map((item) => ({
        ...item,
        value: '["' + item.value.join('","') + '"]',
      })),
      description: formDescription,
      image: imageUrl,
    });
  };

  const { run: updateDish } = useRequest(
    async (obj) => {
      const { data } = await updateDishItem(obj);
      return data;
    },
    {
      manual: true,
      onSuccess(res) {
        //
        console.log(res);
        message.success('更新成功');
        nav('/dish/list');
      },
    },
  );

  const handleUpdate = () => {
    checkForm();
    updateDish({
      id,
      name: formName,
      price: formPrice,
      categoryId: formCategoryId,
      flavors: allflavors.map((item) => ({
        ...item,
        value: '["' + item.value.join('","') + '"]',
      })),
      description: formDescription,
      image: imageUrl,
    });
  };

  return (
    <PageContainer>
      {(loadingGetCategoryList || loadingGetDish) && <Spin />}
      <Form>
        <Form.Item
          label="菜品名称"
          name="name"
          rules={[
            {
              required: true,
              message: '菜品名称为必填项',
            },
          ]}
        >
          <div>
            <Input onChange={(e) => handleForm('name', e.target.value)} value={formName} />
          </div>
        </Form.Item>
        <Form.Item
          label="菜品价格"
          name="price"
          rules={[
            {
              required: true,
              message: '菜品价格为必填项',
            },
            {
              pattern: /^[0-9]*$/,
              message: '请输入有效的数字',
            },
          ]}
        >
          <div>
            <Input onChange={(e) => handleForm('price', e.target.value)} value={formPrice} />
          </div>
        </Form.Item>
        {/* 菜品分类 */}
        <Form.Item
          label="菜品分类"
          name="categoryId"
          rules={[
            {
              required: true,
              message: '菜品分类为必填项',
            },
          ]}
        >
          <div>
            <Select onChange={(e) => handleForm('categoryId', e)} value={formCategoryId}>
              {Object.keys(categoryList).map((categoryId) => (
                <Option key={categoryId} value={categoryId}>
                  {categoryList[categoryId]}
                </Option>
              ))}
            </Select>
          </div>
        </Form.Item>
        {/* 口味做法配置 */}
        <Form.Item label="口味做法配置" name="flavors">
          {allflavors.map((flavors, index) => (
            <div key={index}>
              <Taste
                num={index}
                handleAdd={handleAdd}
                handleDelete={handleDelete}
                item={flavors}
                handleTagChange={handleTagChange}
              />
            </div>
          ))}
          <Button type="primary" onClick={handleAddTaste}>
            添加口味
          </Button>
        </Form.Item>
        {/* 菜品图片,上传图片组件 */}
        <Form.Item
          label="菜品图片"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={handleChange}
          rules={[
            {
              required: true,
              message: '菜品图片为必填项',
            },
          ]}
        >
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/api/common/upload"
            beforeUpload={beforeUpload}
          >
            {imageUrl ? (
              <img
                src={`http://162.14.124.240:8080/common/download?name=${imageUrl}`}
                alt="file"
                style={{ width: '100%' }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        {/* 菜品描述 */}
        <Form.Item label="菜品描述" name="description">
          <div>
            <Input.TextArea
              onChange={(e) => handleForm('description', e.target.value)}
              value={formDescription}
            />
          </div>
        </Form.Item>
      </Form>
      {/* 提交按钮 */}
      <Button type="primary" onClick={id && id !== 'new' ? handleUpdate : handleSubmit}>
        提交
      </Button>
    </PageContainer>
  );
};
export default Dish;
