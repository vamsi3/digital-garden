import { Tabs, TabItem } from '@astrojs/starlight/components';

const CodeIO = ({code, io}) => {
  return (
    <Tabs
      defaultValue="code"
      values={[
      {label: 'Code', value: 'code'},
      {label: 'Input / Output', value: 'io'},
    ]}
    >
      <TabItem value="code"><CodeBlock className="language-cpp">{code}</CodeBlock></TabItem>
      <TabItem value="io"><CodeBlock className="language-cpp">{io}</CodeBlock></TabItem>
    </Tabs>
  );
};

export default CodeIO;
