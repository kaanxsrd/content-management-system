using CmsProduct.Domain;
using Microsoft.EntityFrameworkCore;

namespace CmsProduct.Infrastructure.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ApiKey> ApiKeys => Set<ApiKey>();
    public DbSet<BackendRequestLog> RequestLogs => Set<BackendRequestLog>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ApiKey>(e =>
        {
            e.HasKey(k => k.Id);
            e.Property(k => k.Name).HasMaxLength(200).IsRequired();
            e.Property(k => k.KeyHash).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<BackendRequestLog>(e =>
        {
            e.HasKey(l => l.Id);
            e.Property(l => l.Path).HasMaxLength(500).IsRequired();
            e.Property(l => l.Method).HasMaxLength(10).IsRequired();
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Name).HasMaxLength(200).IsRequired();
            e.Property(p => p.Description).HasMaxLength(1000);
            e.Property(p => p.ImageUrl).HasMaxLength(2048);
            e.Property(p => p.IsActive).HasDefaultValue(true);
            e.Property(p => p.Stock).HasDefaultValue(0);
        });

        modelBuilder.Entity<Address>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.Street).HasMaxLength(300).IsRequired();
            e.Property(a => a.City).HasMaxLength(100).IsRequired();
            e.Property(a => a.ZipCode).HasMaxLength(20).IsRequired();
            e.Property(a => a.Country).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<Customer>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.FirstName).HasMaxLength(100).IsRequired();
            e.Property(c => c.LastName).HasMaxLength(100).IsRequired();
            e.Property(c => c.Email).HasMaxLength(320).IsRequired();
            e.HasOne(c => c.Address).WithMany().HasForeignKey(c => c.AddressId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Order>(e =>
        {
            e.HasKey(o => o.Id);
            e.HasOne(o => o.Customer).WithMany().HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(o => o.ShippingAddress).WithMany().HasForeignKey(o => o.ShippingAddressId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasMany(o => o.Items).WithOne().HasForeignKey(i => i.OrderId);
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.HasKey(i => i.Id);
            e.HasOne<Product>().WithMany().HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
