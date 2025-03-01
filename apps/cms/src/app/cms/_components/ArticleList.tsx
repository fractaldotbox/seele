"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { createEthstorageArticleUrl } from "../utils";
import { ArticleDrawer } from "./ArticleDrawer";

const directoryAddress = "0x73b6443ff19e7ea934ae8e4b0ddcf3d899580be8";

export const ArticleList = ({ articles }: { articles: any[] }) => {
  const [articleKey, setArticleKey] = useState(undefined);

  return (
    <Drawer>
      <Table>
        <TableCaption>
          <div>Articles of Site</div>
          <div>Directory Address: 0xs</div>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Key</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
            <TableHead className="text-right">W3Url</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.key}>
              <TableCell className="font-medium">{article.key}</TableCell>
              <TableCell>{article.status}</TableCell>
              <TableCell>{article.author}</TableCell>
              <TableCell className="text-right">
                <DrawerTrigger
                  key={article.key}
                  onClick={() => {
                    console.log("clicking", article.key);
                    setArticleKey(article.key);
                  }}
                >
                  <Button>Inspect</Button>
                </DrawerTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter> */}
      </Table>
      <ArticleDrawer articleKey={articleKey} />
    </Drawer>
  );
};
