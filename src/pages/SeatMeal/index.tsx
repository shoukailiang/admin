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
import SealForm from './components/SealForm';
import  './index.module.scss'
const { Option } = Select;



interface SetmealDishes {
  name: string;
  price: number;
  dishId: number;
  copies: number;
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

const SeatMeal: React.FC = () => {
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
  const [allSetmealDish, setallSetmealDish] = useState<SetmealDishes[]>([
  ]);

  // useEffect(() => {
  //   console.log(allflavors);
  // }, [allflavors]);

  const { run, loading: loadingGetCategoryList } = useRequest(
    async () => {
      const { data } = await getCategoryList(2);
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
      },
    },
  );

  useEffect(() => {
    // 更新数据
    if (id && id !== 'new') {
      getDishRun(id);
    }
  }, [id]);

  const handleAddSeal = () => {

  };

  const handleDelete = (num: number) => {
  };

  const handleAdd = () => {
  };

  const handleTagChange = (num: number, tag: string) => {
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="uploadButton">Upload</div>
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
        nav('/seatmeal/list');
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
      message.error('套餐名称不能为空');
      return;
    }
    if (!formPrice) {
      message.error('套餐价格不能为空');
      return;
    }
    if (!formCategoryId) {
      message.error('套餐分类不能为空');
      return;
    }
    if (!imageUrl) {
      message.error('套餐图片不能为空');
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
        nav('/seatmeal/list');
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
      description: formDescription,
      image: imageUrl,
    });
  };

  return (
    <PageContainer>
      {(loadingGetCategoryList || loadingGetDish) && <Spin />}
      <Form>
        <Form.Item
          label="套餐名称"
          name="name"
          rules={[
            {
              required: true,
              message: '套餐名称为必填项',
            },
          ]}
        >
          <div>
            <Input onChange={(e) => handleForm('name', e.target.value)} value={formName} />
          </div>
        </Form.Item>
        <Form.Item
          label="套餐价格"
          name="price"
          rules={[
            {
              required: true,
              message: '套餐价格为必填项',
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
          label="套餐分类"
          name="categoryId"
          rules={[
            {
              required: true,
              message: '套餐分类为必填项',
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
        <Form.Item label="套餐菜品" name="flavors" rules={[
          {
            required: true,
            message: '套餐菜品为必填项',
          },
        ]}>
          <Button type="primary" onClick={handleOpenModal}>
            添加套餐
          </Button>
        </Form.Item>
        {/* 菜品图片,上传图片组件 */}
        <Form.Item
          label="套餐图片"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={handleChange}
          rules={[
            {
              required: true,
              message: '套餐图片为必填项',
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
        <Form.Item label="套餐描述" name="description">
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
      <SealForm open={modalVisible} onClose={handleCloseModal} categoryList={categoryList}/>
    </PageContainer>
  );
};
export default SeatMeal;
