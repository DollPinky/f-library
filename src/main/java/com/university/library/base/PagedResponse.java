package com.university.library.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Iterator;
import java.util.List;
import java.util.function.Function;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PagedResponse<T> implements Page<T> {
    
    private List<T> content;
    
    private int number;
    
    private int size;
    
    private long totalElements;
    
    private int totalPages;
    
    private boolean hasNext;
    
    private boolean hasPrevious;
    
    private boolean isFirst;
    
    private boolean isLast;
    
    private Sort sort;
    
    private boolean hasContent;
    
    public static <T> PagedResponse<T> fromPage(Page<T> page) {
        return PagedResponse.<T>builder()
                .content(page.getContent())
                .number(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .sort(page.getSort())
                .hasContent(page.hasContent())
                .build();
    }
    
    public static <T> PagedResponse<T> empty() {
        return PagedResponse.<T>builder()
                .content(List.of())
                .number(0)
                .size(0)
                .totalElements(0)
                .totalPages(0)
                .hasNext(false)
                .hasPrevious(false)
                .isFirst(true)
                .isLast(true)
                .sort(Sort.unsorted())
                .hasContent(false)
                .build();
    }
    
    public static <T> PagedResponse<T> of(List<T> content, int pageNumber, int pageSize, long totalElements) {
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);
        
        return PagedResponse.<T>builder()
                .content(content)
                .number(pageNumber)
                .size(pageSize)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .hasNext(pageNumber < totalPages - 1)
                .hasPrevious(pageNumber > 0)
                .isFirst(pageNumber == 0)
                .isLast(pageNumber == totalPages - 1)
                .sort(Sort.unsorted())
                .hasContent(!content.isEmpty())
                .build();
    }
    
    @Override
    public int getTotalPages() {
        return totalPages;
    }
    
    @Override
    public long getTotalElements() {
        return totalElements;
    }
    
    @Override
    public int getNumber() {
        return number;
    }
    
    @Override
    public int getSize() {
        return size;
    }
    
    @Override
    public int getNumberOfElements() {
        return content.size();
    }
    
    @Override
    public List<T> getContent() {
        return content;
    }
    
    @Override
    public boolean hasContent() {
        return hasContent;
    }
    
    @Override
    public Sort getSort() {
        return sort;
    }
    
    @Override
    public boolean isFirst() {
        return isFirst;
    }
    
    @Override
    public boolean isLast() {
        return isLast;
    }
    
    @Override
    public boolean hasNext() {
        return hasNext;
    }
    
    @Override
    public boolean hasPrevious() {
        return hasPrevious;
    }
    
    @Override
    public Pageable nextPageable() {
        return hasNext ? Pageable.ofSize(size).withPage(number + 1) : null;
    }
    
    @Override
    public Pageable previousPageable() {
        return hasPrevious ? Pageable.ofSize(size).withPage(number - 1) : null;
    }
    
    @Override
    public <U> Page<U> map(Function<? super T, ? extends U> converter) {
        List<U> convertedContent = content.stream().map(converter).collect(java.util.stream.Collectors.toList());
        return PagedResponse.<U>builder()
                .content(convertedContent)
                .number(number)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .hasNext(hasNext)
                .hasPrevious(hasPrevious)
                .isFirst(isFirst)
                .isLast(isLast)
                .sort(sort)
                .hasContent(!convertedContent.isEmpty())
                .build();
    }
    
    @Override
    public Iterator<T> iterator() {
        return content.iterator();
    }
    
    public int getPageNumber() {
        return number;
    }
    
    public int getPageSize() {
        return size;
    }
} 