export type Comment = {
  id: number;
  selectionId: number;
  text: string;
  date: string;
  userAvatar: string;
  username: string;
};

export type Selection = {
  id: number;
  text: string;
  selector: string;
};
