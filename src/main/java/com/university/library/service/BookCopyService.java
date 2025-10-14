package com.university.library.service;


import com.university.library.base.PagedResponse;
import com.university.library.dto.request.bookCopy.BookCopySearchParams;
import com.university.library.dto.request.bookCopy.BookDonationRequest;
import com.university.library.dto.request.bookCopy.CreateBookCopyCommand;
import com.university.library.dto.request.bookCopy.CreateBookCopyFromBookCommand;
import com.university.library.dto.response.bookCopy.BookCopyResponse;
import com.university.library.entity.BookCopy;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface BookCopyService {
    /**
     * Query
     */
     BookCopyResponse getBookCopyById(UUID bookCopyId) ;
     PagedResponse<BookCopyResponse> searchBookCopies(BookCopySearchParams params);
     List<BookCopyResponse> getBookCopiesByBookId(UUID bookId);
     List<BookCopyResponse> getAvailableBookCopiesByBookId(UUID bookId);
     byte[] generateAllQRCodesPDF() throws Exception;
     byte[] generateQRCodeImage(UUID bookCopyID) throws Exception;

    List<BookCopyResponse> findByCategory(UUID category);
    List<BookCopyResponse> findByCategoryAndStatus(UUID category, BookCopy.BookStatus status);

 /**
  * Command
  */
   BookCopyResponse updateBookCopy(UUID bookCopyId, CreateBookCopyCommand command);
   void deleteBookCopy(UUID bookCopyId);
   BookCopyResponse changeBookCopyStatus(UUID bookCopyId, CreateBookCopyCommand.BookStatus newStatus);
  void createBookCopiesFromBook(CreateBookCopyFromBookCommand command);
  BookCopyResponse bookDonation(BookDonationRequest request);

   List<BookCopyResponse> importBookDonation(MultipartFile file) throws IOException;
}
