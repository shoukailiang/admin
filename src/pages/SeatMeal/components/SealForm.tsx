import { Modal } from 'antd';
import React, { useState } from 'react';
import './index.css';
type Props = {
  open: boolean;
  onClose: () => void;
  categoryList: { [key: number]: string };
};




const SealForm: React.FC<Props> = ({ open, onClose, categoryList }) => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const getCategoryInfo = (key:string,index:number) => {
    setClickedIndex(index);
  }
  return (
    <Modal
      title="添加套餐"
      centered
      open={open}
      onOk={onClose}
      onCancel={onClose}
      width={1000}
    >
      <div className="grid-container">
        <div className="column1">
          {Object.keys(categoryList).map((key,index) => {
            const item = categoryList[key];
            const isClicked = index === clickedIndex;
            return (
              <div  className={`row1 ${isClicked ? 'clicked' : ''}`} key={key}>
                <p onClick={()=>getCategoryInfo(key,index)}>{item}</p>
              </div>
            );
          })}
        </div>
        <div className="column2">
          <p>Column 2</p>
        </div>
        <div className="column3">
          <p>Column 3</p>
        </div>
      </div>
    </Modal>
  );
};

export default SealForm;
