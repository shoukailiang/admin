import { getcategoryById } from '@/services/ant-design-pro/api';
import { Checkbox, Modal } from 'antd';
import React, { useState } from 'react';
import './index.css';

export type setmealDishes = {
  copies: number;
  id: string;
  name: string;
  price: number;
};


type Props = {
  open: boolean;
  onClose: () => void;
  categoryList: { [key: string]: string };
  // 将这个套餐的信息传递给父组件
  onSealFormSubmit: (setmealInfo: setmealDishes[]) => void;
};


const SealForm: React.FC<Props> = ({ open, onClose, categoryList,onSealFormSubmit }) => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  // 这个是我选择的菜品
  const [selectedDishItems, setSelectedDishItems] = useState<string[]>([]);

  // 这个是后端返回给我当前这个类别的所有菜品
  const [dishItem, setDishItem] = useState<API.DishListItem[]>([]);

  // 所有类别的菜品
  const [allDishItem, setAllDishItem] = useState<API.DishListItem[]>([]);

  const getCategoryInfo = async (key: string, index: number) => {
    setClickedIndex(index);

    let res = await getcategoryById(key);
    setDishItem(res.data);
    setAllDishItem([...allDishItem,...res.data]);

  };

  const toggleDishItemSelection = (itemId: string) => {
    setSelectedDishItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
  };

  const handleDelete = (id:string) => {
    setSelectedDishItems(selectedDishItems.filter((item)=>item!==id));
  }

  const onOk = () => {
    console.log(selectedDishItems)
    const formattedDishItems = selectedDishItems.map((id) => ({
      copies: 1,
      id: id,
      name: allDishItem.find((item) => item.id === id)?.name || '',
      price: allDishItem.find((item) => item.id === id)?.price || 0,
    }));
    onSealFormSubmit(formattedDishItems);
    setAllDishItem([]);
    setSelectedDishItems([]);
    setDishItem([]);
  }

  return (
    <Modal title="添加套餐" centered open={open} onOk={onOk} onCancel={onClose} width={1000}>
      <div className="grid-container">
        <div className="column1">
          {Object.keys(categoryList).map((key:string, index:number) => {
            const item = categoryList[key];
            const isClicked = index === clickedIndex;
            return (
              <div className={`row1 ${isClicked ? 'clicked' : ''}`} key={key}>
                <p onClick={() => getCategoryInfo(key, index)}>{item}</p>
              </div>
            );
          })}
        </div>
        <div className="column2">
          {dishItem.length === 0 ? (
            <p>暂无数据</p>
          ) : (
            dishItem.map((item:API.DishListItem) => (
              <div className="row2" key={item.id}>
                <Checkbox
                  checked={selectedDishItems.includes(item.id)}
                  onChange={() => toggleDishItemSelection(item.id)}
                >
                  {item.name} - {item.price/100}元
                </Checkbox>
              </div>
            ))
          )}
        </div>
        <div className="column3">
          {selectedDishItems.length === 0 ? (
            <p>暂无数据</p>
          ) : (
            selectedDishItems.map((id) => {
              const item = allDishItem.find((item) => item.id === id);
              if(item){
                return (
                  <div className="row3" key={id} >
                    {item?.name} - {item.price/100}元
                    <button type='button' onClick={()=>handleDelete(id)}>X</button>
                  </div>
                );
              }else{
                return null;
              }
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SealForm;
