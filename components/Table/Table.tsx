import React from 'react';

interface TableProps {
  title?: string;
  caption: string;  
}

const Table = (props: TableProps) => {
  const { title, caption } = props;
  return (
    <>Table</>
  );
};

Table.defaultProps = {

};

Table.propTypes = {

};

export default Table;
