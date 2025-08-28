import path from 'path';
import fs from 'fs/promises';
import UserModel from '@/model/User';
import { sendEmailToAuthorForLogin } from '@/helpers/sendEmailToAuthorForLogin';
import os from 'os'; // Import os for temp directory
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from '@/helpers/cloudinaryUploadFile';

export async function handleFileUpload(paperFile: File,paperID:string,conference:string) {
  const tempDir = os.tmpdir(); // Use system temp directory
  const parts = paperID.split("-");
  const paperNumber = parts[parts.length - 1];
  const originalName = paperFile.name;
  const renamedFile = `_${paperNumber}_${originalName}`;
  
  const tempFilePath = path.join(tempDir,renamedFile);

  const arrayBuffer = await paperFile.arrayBuffer();
  await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer)); // Write to temp dir

  const uploadedFile = await uploadOnCloudinary(tempFilePath,renamedFile,conference);

  await fs.unlink(tempFilePath); // Clean up temp file

  if (!uploadedFile) {
    throw new Error('File is unable to upload on Cloudinary');
  }

  return uploadedFile.secure_url;
}




interface paperAuthorType {
  name:string,
  email: string;
  country: string;
  affiliation: string;
  WebPage: string;
  isCorrespondingAuthor: boolean;
}

export async function validateAuthors(paperAuthorsArray: paperAuthorType[],paperTitle:string) {
  let Authors: any[] = [];
  let CorrespondingAuthors: any[] = [];
  // let ErrorOfNotGettingUser: { success: boolean; message: string }[] = [];

  const authorChecks = paperAuthorsArray.map(
    async (paperAuthor: paperAuthorType) => {
      try {
        const User = await UserModel.findOne({
          $and: [{ email: paperAuthor.email }, { isVerified: true }],
        });
        
        if (paperAuthor.isCorrespondingAuthor) {
          const AuthorObj:any={email:paperAuthor.email,name:paperAuthor.name,affilation:paperAuthor.affiliation,country:paperAuthor.country}
          if(User?._id){
            AuthorObj["userId"]=User?._id
          }
          CorrespondingAuthors.push(AuthorObj);
        } else {
          const AuthorObj:any={email:paperAuthor.email,name:paperAuthor.name,affilation:paperAuthor.affiliation,country:paperAuthor.country}
          if(User?._id){
            AuthorObj["userId"]=User?._id
          }
          Authors.push(AuthorObj);
        }
        
        if(!User?._id){
          sendEmailToAuthorForLogin(paperAuthor.email,paperAuthor.isCorrespondingAuthor,paperTitle)
        }
      } catch (error) {
        console.log(error)
      }
    },
  );

  await Promise.all(authorChecks);
  console.log("Authors:", Authors);
  console.log("Corresponding Authors:", CorrespondingAuthors);

  return { Authors, CorrespondingAuthors };
}
