declare module 'react-native-share' {
  export interface ShareOptions {
    title?: string;
    url?: string;
    type?: string;
    message?: string;
    subject?: string;
  }

  interface ShareInterface {
    open(options: ShareOptions): Promise<any>;
  }

  const Share: ShareInterface;
  export default Share;
}
